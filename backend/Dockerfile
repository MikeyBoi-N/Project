# Use an official Python runtime as a parent image
FROM python:3.13-slim as builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install Poetry
RUN pip install poetry==1.8.2 # Pinning poetry version for stability

# Set the working directory in the container
WORKDIR /app

# Copy only necessary files for dependency installation
COPY pyproject.toml poetry.lock* ./
# poetry.lock might not exist yet, the '*' handles that

# Install project dependencies using Poetry
# --no-root: Don't install the project itself yet, only dependencies
# --no-dev: Don't install development dependencies in the final image
RUN poetry config virtualenvs.create false ; \
    poetry install --no-interaction --no-ansi --no-root --no-dev

# --- Final Stage ---
FROM python:3.13-slim

WORKDIR /app

# Copy installed dependencies from the builder stage
COPY --from=builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=builder /usr/local/bin/uvicorn /usr/local/bin/uvicorn

# Copy the rest of the application code
COPY . /app

# Expose the port the app runs on (defined in docker-compose.yml command)
EXPOSE 8000

# The command to run the app is specified in docker-compose.yml
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]