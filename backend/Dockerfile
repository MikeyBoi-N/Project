# Stage 1: Builder
# Use the full Python 3.13 image which includes build tools prerequisites
FROM python:3.13 AS builder

# Install OS-level build dependencies required for compiling some Python packages (like numpy)
# Using semicolon as per global instructions
RUN apt-get update ; apt-get install -y --no-install-recommends build-essential python3-dev

# Set working directory
WORKDIR /build

# Install Poetry
RUN pip install --no-cache-dir poetry==1.8.2

# Configure Poetry (optional, but good practice if needed)
RUN poetry config virtualenvs.create false

# Copy dependency definition files
COPY pyproject.toml poetry.lock* ./

COPY ./app ./app
RUN poetry lock

# Export dependencies to requirements.txt
# --without-hashes is often helpful for pip wheel compatibility
RUN poetry export --without-hashes --no-interaction --output /opt/requirements.txt

# Build wheels for all dependencies
# This compiles packages needing compilation within this stage
RUN pip wheel --no-cache-dir --wheel-dir=/opt/wheels -r /opt/requirements.txt

# Stage 2: Final Application Image
# Use the slim image for a smaller final size
FROM python:3.13-slim

# Create a non-root user and group for security
RUN addgroup --system --gid 1001 appgroup ; \
    adduser --system --uid 1001 --ingroup appgroup --home /home/appuser appuser
RUN chown appuser:appgroup /home/appuser

# Set working directory
WORKDIR /app

# Copy requirements.txt and wheels from the builder stage
# Ensure correct ownership for the non-root user
COPY --from=builder --chown=appuser:appgroup /opt/requirements.txt /opt/requirements.txt
COPY --from=builder --chown=appuser:appgroup /opt/wheels /opt/wheels
# Clean up build artifacts immediately after copying, while still root
# Removed cleanup from here, moved after pip install as root


# Set environment variable for PATH to include user's local bin
ENV PATH="/home/appuser/.local/bin:${PATH}"

# Switch to the non-root user BEFORE installing packages
ENV PYTHONUSERBASE=/home/appuser/.local
USER appuser

# Install dependencies from local wheels
# --no-index prevents reaching out to PyPI
# --find-links points pip to the local wheels directory
RUN pip install --no-cache-dir --no-index --find-links=/opt/wheels -r /opt/requirements.txt

# Switch back to root to clean up build artifacts
USER root
RUN rm -rf /opt/wheels /opt/requirements.txt

# Switch back to appuser before copying application code
USER appuser

# Copy the application code into the container
# Ensure correct ownership
COPY --chown=appuser:appgroup . /app

# Expose the port the application runs on
EXPOSE 8000

# Command to run the application
# Assumes your FastAPI app instance is named 'app' in 'app/main.py'
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]