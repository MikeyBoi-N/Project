# Backend Docker Build Troubleshooting Report

This report details the troubleshooting process undertaken to resolve a series of build errors encountered with the `backend` service's Dockerfile. The goal is to document the issues, fixes, and analysis for future reference and onboarding.

## 1. Problem Summary

The initial problem (Error 1) manifested during the Docker build process (`docker-compose build backend`). The build failed at the `pip install` step within the final stage, which attempted to install Python dependencies from local wheel files.

**Initial Error:**
```
=> ERROR [backend stage-1 6/8] RUN pip install --no-cache-dir --no-index --find-links=/wheels -r /requirements.txt
------
 > [backend stage-1 6/8] RUN pip install --no-cache-dir --no-index --find-links=/wheels -r /requirements.txt:
#0 1.186 ERROR: Could not find a version that satisfies the requirement ...
#0 1.186 ERROR: No matching distribution found for ...
------
```
*(Note: Specific package error messages omitted for brevity, but the core issue was failure to find/install packages from `/wheels` using `/requirements.txt`)*

This indicated a potential issue with accessing the wheel files or the requirements file at the specified paths (`/wheels`, `/requirements.txt`) within the container's final stage.

## 2. Investigation Steps

The troubleshooting involved iteratively identifying the cause of each build failure and applying fixes to the `backend/Dockerfile`.

1.  **Error 1:** `pip install` fails to find packages from `/wheels`.
    *   **Hypothesis:** Path conflict or files not available at root (`/`).
    *   **Fix 1:** Modified `Dockerfile` to use `/opt/wheels` and `/opt/requirements.txt` in both the builder and final stages for consistency and to avoid root-level conflicts. `COPY --from=builder /wheels /opt/wheels` and `COPY --from=builder /app/requirements.txt /opt/requirements.txt`. The `pip install` command was updated accordingly.

2.  **Error 2:** Build failed during `poetry export` in the *builder* stage.
    *   **Error Message:** `Warning: poetry.lock is not consistent with pyproject.toml... failed to solve: process "/bin/sh -c poetry export ..."`
    *   **Hypothesis:** The `poetry.lock` file was either missing, outdated, or inconsistent with `pyproject.toml`.
    *   **Fix 2:** Added `RUN poetry lock --no-update` *before* the `poetry export` command in the builder stage to ensure a consistent lock file was generated based on `pyproject.toml` without attempting to update dependencies.

3.  **Error 3:** Build failed during the newly added `poetry lock --no-update` step.
    *   **Error Message:** Involved a `SolverProblemError` related to package discovery, mentioning `'files'`.
    *   **Hypothesis:** Poetry couldn't correctly identify the local package structure.
    *   **Fix 3:** Created an empty `backend/app/__init__.py` file to explicitly mark the `app` directory as a Python package.

4.  **Error 4:** Build *still* failed during `poetry lock --no-update` with the same `'files'` error.
    *   **Hypothesis:** Even with `__init__.py`, the `poetry lock` command didn't have access to the actual source code defined in `pyproject.toml`'s `[tool.poetry.packages]` section within the builder stage's context at that point.
    *   **Fix 4:** Added `COPY ./app ./app` *before* the `RUN poetry lock --no-update` command in the builder stage to make the application source code available.

5.  **Error 5:** Build *still* failed during `poetry lock --no-update` with the same `'files'` error.
    *   **Hypothesis:** The `--no-update` flag might be preventing Poetry from resolving dependencies correctly, even if just generating the lock file based on `pyproject.toml`.
    *   **Fix 5:** Removed the `--no-update` flag from the `poetry lock` command, allowing it to resolve and potentially update dependencies if needed to create a valid lock file. `RUN poetry lock`.

6.  **Error 6:** Build failed during `pip install` in the *final* stage (running as `appuser`).
    *   **Error Message:** `OSError: [Errno 13] Permission denied: '/nonexistent'` (or similar path related to user site-packages).
    *   **Hypothesis:** The `appuser` did not have permission to install packages to the default system-wide site-packages directory, and the user-specific installation path was not properly configured or accessible.
    *   **Fix 6:** Added `ENV PYTHONUSERBASE=/home/appuser/.local` *before* the `USER appuser` instruction to explicitly set the user-specific installation directory. Added `ENV PATH="/home/appuser/.local/bin:${PATH}"` to ensure installed binaries are in the PATH.

7.  **Error 7:** Build failed during `pip install` in the final stage.
    *   **Error Message:** `OSError: [Errno 13] Permission denied: '/home/appuser'`
    *   **Hypothesis:** The `appuser` did not have ownership or write permissions for its own home directory `/home/appuser`, preventing the creation of the `.local` directory structure needed by `PYTHONUSERBASE`.
    *   **Fix 7:** Added `RUN chown appuser:appgroup /home/appuser` *after* the `adduser` command but *before* switching to `appuser`.

8.  **Error 8:** Build failed at the `adduser` command.
    *   **Error Message:** Indicated an unknown option `--create-home`.
    *   **Hypothesis:** The specific `adduser` implementation in the base image (`python:3.11-slim`) does not support `--create-home` for system users.
    *   **Fix 8:** Changed the `adduser` command flag from `--create-home` to the correct `--home /home/appuser` to specify the home directory path.

9.  **Error 9:** Build failed at the cleanup step `RUN rm -rf /opt/wheels /opt/requirements.txt`.
    *   **Error Message:** Permission denied errors.
    *   **Hypothesis:** This command was running *after* `USER appuser`, and `appuser` did not have permissions to delete files in `/opt`.
    *   **Fix 9:** Moved the `RUN rm -rf /opt/wheels /opt/requirements.txt` command to execute *before* the `USER appuser` instruction, ensuring it ran as `root`.

10. **Error 10 (Latest Error):** Build failed during `pip install` in the final stage.
    *   **Error Message:** `ERROR: Could not open requirements file: [Errno 2] No such file or directory: '/opt/requirements.txt'`
    *   **Analysis:** Fix 9 moved the cleanup step *too early*. It now ran before the `pip install` command that *needed* `/opt/requirements.txt`.

## 3. Changes Implemented (Cumulative before Error 10)

Based on the successful fixes (1, 2, 4, 5, 6, 8, 9), the `backend/Dockerfile` evolved significantly. The key changes leading up to the state *before* Error 10 occurred were:

*   **Builder Stage:**
    *   Copies `./app` source code (`COPY ./app ./app`).
    *   Runs `poetry lock` (without `--no-update`) to generate/update `poetry.lock`.
    *   Runs `poetry export` to generate `requirements.txt`.
    *   Copies generated `requirements.txt` and built wheels to distinct `/opt` locations (`/opt/requirements.txt`, `/opt/wheels`) for the final stage.
*   **Final Stage:**
    *   Creates `appgroup` and `appuser` with a specified home directory (`--home /home/appuser`).
    *   Sets `PYTHONUSERBASE` and updates `PATH` for user-specific pip installs (`ENV PYTHONUSERBASE=/home/appuser/.local`, `ENV PATH=...`).
    *   Changes ownership of the home directory (`RUN chown appuser:appgroup /home/appuser`).
    *   Copies wheels and requirements from the builder stage to `/opt` (`COPY --from=builder /opt/wheels /opt/wheels`, `COPY --from=builder /opt/requirements.txt /opt/requirements.txt`).
    *   **Cleanup:** Removes wheels and requirements *before* switching user (`RUN rm -rf /opt/wheels /opt/requirements.txt`). **(This was the problematic change introduced in Fix 9)**.
    *   Switches to `appuser` (`USER appuser`).
    *   Installs dependencies using the user scheme (`RUN pip install --user --no-cache-dir --no-index --find-links=/opt/wheels -r /opt/requirements.txt`).
    *   Copies the application code (`COPY . /app`).

The intended final state was a container running as a non-root user (`appuser`) with dependencies installed correctly from locally built wheels into the user's site-packages directory, and unnecessary build artifacts removed.

## 4. Root Cause Analysis

The series of errors stemmed from several interconnected factors:

1.  **Initial Setup:** The project likely started without a committed `poetry.lock` file, leading to inconsistencies when `poetry export` was first introduced (Error 2).
2.  **Multi-Stage Build Complexity:** Managing file paths, permissions, and command execution order across different stages (builder vs. final) and different users (`root` vs. `appuser`) is inherently complex. Assumptions about file availability or permissions at a given step proved incorrect multiple times.
3.  **Tooling Misunderstandings:**
    *   **Poetry:** Required explicit source code copying (`COPY ./app ./app`) before `poetry lock` could correctly discover packages (Error 4). The necessity of removing `--no-update` (Error 5) suggests subtle interactions in dependency resolution even when aiming only for lock file generation.
    *   **pip User Installs:** Required explicit `PYTHONUSERBASE` and `PATH` configuration (Error 6) and correct home directory permissions (Error 7).
    *   **adduser:** The base image's `adduser` had different flags than assumed (Error 8).
4.  **Permissions:** Switching from `root` to `appuser` requires careful management of file/directory ownership and permissions, particularly for the user's home directory and installation paths (Errors 6, 7, 9).
5.  **Command Ordering:** The order of operations was critical. Installing dependencies requires the requirements file; cleaning up artifacts must happen *after* they are used but *before* potentially losing permissions to do so (Errors 9, 10).

## 5. Alternative Solutions

While the iterative approach fixed the issues encountered, other strategies could have been considered:

*   **Different Base Image:** Using a base image with `adduser` supporting `--create-home` or one with different default user permissions might have avoided some issues. A full Python image (non-slim) might include more build tools, potentially simplifying earlier steps.
*   **Simplified Dependency Management:** If offline installation wasn't strictly required, installing directly from PyPI (`pip install -r requirements.txt` generated from `poetry export` without `--no-index` or `--find-links`) in the final stage could have bypassed wheel management issues, though potentially increasing build time or introducing inconsistencies if `poetry.lock` wasn't tightly controlled.
*   **Single Stage Build (Less Recommended):** A single-stage build could simplify paths but would result in a larger final image containing build tools (like Poetry).
*   **Permissions Handling:** Instead of `chown`-ing `/home/appuser`, one could potentially create the `.local` directory structure as root and `chown` only that, although managing the home directory ownership is generally cleaner.
*   **Cleanup Strategy:** Cleanup could potentially be done in the builder stage *before* copying artifacts, or by copying only necessary files instead of cleaning up later.

## 6. Analysis of Recurring Errors

The troubleshooting required multiple iterations primarily due to the layered nature of the problems:

*   **Interdependencies:** Fixing one issue (e.g., path conflicts) revealed the next underlying problem (e.g., lock file inconsistency).
*   **Environment Complexity:** The Docker container environment, especially with multi-stage builds, user switching, and specific tool behaviors (`poetry`, `pip --user`, `adduser`), presented nuances not immediately obvious. Each fix addressed a specific symptom, but the root causes were often related to the interactions between these elements.
*   **Incremental Understanding:** Each error provided more insight into how the tools and Docker layers interacted, leading to progressively more refined fixes. For example, understanding that `poetry lock` needed the source code present, or that `pip install --user` required specific environment variables and directory permissions.
*   **Overcorrection:** Fix 9 was an example of fixing one problem (permissions for cleanup) by introducing another (cleaning up too early), highlighting the need to consider the full sequence of operations.

## 7. Analysis of Latest Error & Next Steps

**Latest Error (Error 10):**
```
ERROR: Could not open requirements file: [Errno 2] No such file or directory: '/opt/requirements.txt'
```

**Cause:** This error occurred because Fix 9 moved the cleanup command (`RUN rm -rf /opt/wheels /opt/requirements.txt`) to run *before* the `USER appuser` instruction. While this correctly executed the cleanup as `root` (solving Error 9's permission issue), it meant the `/opt/requirements.txt` file was deleted *before* the subsequent `RUN pip install --user ... -r /opt/requirements.txt` command (running as `appuser`) could use it.

**Proposed Next Step:**

The cleanup command needs to happen *after* the dependencies are installed but *before* the final application code is copied (to keep the image clean). Crucially, it still needs `root` privileges if `appuser` doesn't have rights in `/opt`.

The correct placement for the cleanup command is **after** the `pip install` command. To execute it with the necessary permissions, it should ideally run as `root`. This can be achieved by placing it *before* the final `USER appuser` switch, but *after* the `pip install` command that uses the files.

**Corrected Order Snippet (Conceptual):**

```Dockerfile
# ... (previous steps including creating user, setting ENV vars, chown home dir) ...

# Copy artifacts needed for install
COPY --from=builder /opt/wheels /opt/wheels
COPY --from=builder /opt/requirements.txt /opt/requirements.txt

# Switch to user TEMPORARILY for install (if install must be as user)
# USER appuser
# RUN pip install --user --no-cache-dir --no-index --find-links=/opt/wheels -r /opt/requirements.txt
# USER root # Switch back to root for cleanup

# OR: Install as root if system-wide install is acceptable/simpler, then cleanup
RUN pip install --no-cache-dir --no-index --find-links=/opt/wheels -r /opt/requirements.txt # Example: Install as root

# Cleanup (as root)
RUN rm -rf /opt/wheels /opt/requirements.txt

# Switch to final user
USER appuser

# Copy application code
COPY . /app

# Set WORKDIR, CMD etc.
WORKDIR /app
CMD ["..."]
```
*(The exact `pip install` command depends on whether installation *must* happen as `appuser` or if installing as `root` first is acceptable)*. The key is: **Install -> Cleanup -> Switch User (Final)**.

If the installation *must* happen as `appuser`, the sequence would be: `COPY artifacts` -> `USER appuser` -> `RUN pip install --user ...` -> `USER root` -> `RUN rm -rf ...` -> `USER appuser` -> `COPY . /app`. This involves switching users multiple times but ensures correct permissions for each step.