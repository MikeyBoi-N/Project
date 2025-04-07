# Backend Dockerfile Optimization Summary

## Task Summary

Evaluate the `backend/Dockerfile` to identify optimizations for faster build times during local development using `docker-compose up`, focusing on removing unnecessary steps while ensuring the application runs correctly for testing frontend/backend interaction.

## Findings

1.  **Current Dockerfile:** Uses a multi-stage build (`python:3.13` builder -> `python:3.13-slim` final) which includes:
    *   Installing OS build tools (`build-essential`, `python3-dev`).
    *   Installing Poetry.
    *   Exporting dependencies to `requirements.txt`.
    *   Building Python wheels (`pip wheel`).
    *   Creating a non-root user.
    *   Copying wheels and requirements to the final stage.
    *   Installing dependencies from local wheels (`pip install --no-index`).
    *   Copying the application code (`COPY . /app`).
2.  **Docker Compose (`docker-compose.yml`):**
    *   Mounts the local `./backend` directory to `/app` inside the container (`volumes: - ./backend:/app`).
    *   Overrides the Dockerfile `CMD` to use `uvicorn ... --reload`.
3.  **Redundancy:** The volume mount and `--reload` mean that the application code copied during the Docker build (`COPY . /app`) is immediately overshadowed by the mounted local code. Building wheels and the multi-stage copy process are unnecessary for local development speed.
4.  **Dependencies:** `pyproject.toml` includes packages like `numpy`, `scipy`, `opencv-python-headless`, which often require compilation and thus need build tools available during installation.

## Fixes Tried

*   None yet. This is the initial analysis.

## Current Issues

*   Slow build times for the `backend` service when running `docker-compose up` due to the production-focused multi-stage build process being used for development.

## Failed Changes

*   N/A

## Proposed Solution

1.  **Create `backend/Dockerfile.dev`:** Introduce a new Dockerfile specifically for local development to avoid modifying the production-ready `Dockerfile`.
2.  **Simplify `Dockerfile.dev`:**
    *   Use a single stage based on the full `python:3.13` image (includes most common build tools, simplifying OS dependency management for dev).
    *   Set `WORKDIR /app`.
    *   Install Poetry (`pip install poetry`).
    *   Configure Poetry (`poetry config virtualenvs.create false`).
    *   Copy *only* `pyproject.toml` and `poetry.lock*` to leverage Docker caching.
    *   Run `poetry install --no-root` to install only dependencies directly. `--no-root` prevents Poetry from trying to install the project package itself, which isn't needed as the code is mounted.
    *   **Omit:** OS `apt-get install` (rely on base image), wheel building, multi-stage copies, final `COPY . /app`, and potentially the non-root user setup for maximum dev build speed.
    *   Keep `EXPOSE 8000`.
    *   Keep the `CMD` (as a fallback, though `docker-compose.yml` overrides it).
3.  **Update `docker-compose.yml`:** Modify the `backend` service definition to use the new development Dockerfile:
    ```yaml
    services:
      backend:
        build:
          context: ./backend
          dockerfile: Dockerfile.dev # Use the new dev Dockerfile
        # ... rest of the service definition
    ```

## Five Questions to Drive Further Refinement

1.  Are there any *runtime* OS-level dependencies (e.g., specific libraries needed by OpenCV or Tesseract later) that are not included in the base `python:3.13` image and would need explicit `apt-get install` even in `Dockerfile.dev`?
2.  Is maintaining the non-root user setup considered critical even for the local `Dockerfile.dev`, or is the simplification for speed acceptable in the development context? (The proposed solution omits it for speed).
3.  Does the `frontend` service build also experience significant delays, suggesting its `Dockerfile` might benefit from a similar development-specific optimization review?
4.  Are specific dependencies like `opencv-python-headless` or `ultralytics` known to take a very long time to install, potentially justifying exploring pre-built images or alternative installation strategies if `poetry install` remains slow?
5.  Confirming the original `backend/Dockerfile` should be kept unmodified for production builds, meaning we will maintain both `Dockerfile` and `Dockerfile.dev` going forward?

## Code Effects

*   **Positive:** Significantly faster build times for the backend service during local development (`docker-compose up`). Better utilization of Docker layer caching for dependencies. Simpler Dockerfile logic for development.
*   **Neutral/Negative:** The resulting `backend` development image will likely be larger than the production image (due to the full base image vs. slim). The development container might run as root (if non-root user setup is omitted), differing slightly from the production environment's security posture.