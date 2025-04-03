# --- Builder Stage ---
    FROM python:3.13 AS builder

    # Set environment variables
    ENV PYTHONDONTWRITEBYTECODE=1 \
        PYTHONUNBUFFERED=1
    
    # Install Poetry
    RUN pip install --no-cache-dir poetry==1.8.2
    
    # Set working directory
    WORKDIR /app
    
    # Copy dependency files
    COPY pyproject.toml poetry.lock* ./
    
    # Export dependencies to requirements.txt
    RUN poetry export -f requirements.txt --output requirements.txt --without-hashes
    
    # Install build dependencies for compiling packages
    RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        python3-dev \
     && apt-get clean \
     && rm -rf /var/lib/apt/lists/*
    
    # Build wheels for dependencies
    RUN pip wheel -r requirements.txt -w wheels/
    
    # --- Final Stage ---
    FROM python:3.13-slim
    
    # Set working directory
    WORKDIR /app
    
    # Copy wheels and requirements from builder
    COPY --from=builder /app/wheels /wheels
    COPY --from=builder /app/requirements.txt /requirements.txt
    
    # Install dependencies from wheels and clean up
    RUN pip install --no-index --find-links=/wheels -r /requirements.txt \
     && rm -rf /wheels /requirements.txt
    
    # Copy application code
    COPY . /app
    
    # Expose port
    EXPOSE 8000
    
    # Run the application
    CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]