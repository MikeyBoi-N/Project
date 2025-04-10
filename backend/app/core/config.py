from typing import List, Optional

from pydantic import AnyHttpUrl, EmailStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    Utilizes pydantic-settings for automatic loading and validation.
    """

    # --- Core Application Settings ---
    PROJECT_NAME: str = "Selkie Backend"
    API_V1_STR: str = "/api/v1"  # Base path for API version 1 (if used)
    # BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [] # Configure CORS origins if needed

    # --- JWT Settings (from auth/security.py, now centralized) ---
    SECRET_KEY: str = "a_very_secret_key_that_should_be_changed_in_env"  # CHANGE THIS!
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # --- Neo4j Database Settings ---
    NEO4J_URI: str = "bolt://graphdb:7687"  # Default for docker-compose service name
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str

    # --- MinIO Object Storage Settings ---
    MINIO_ENDPOINT: str = "objectstore:9000"  # Default for docker-compose service name
    MINIO_ACCESS_KEY: str = "minioadmin"  # Default MinIO access key
    MINIO_SECRET_KEY: str  # Needs to be set in environment
    MINIO_BUCKET_NAME: str = "selkie-documents"  # Example bucket name
    MINIO_USE_SSL: bool = False  # Set to True if MinIO uses HTTPS

    # --- Google OAuth Settings ---
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str  # e.g., http://localhost:8000/api/v1/auth/google/callback or your frontend callback handler

    # Pydantic Settings Configuration
    model_config = SettingsConfigDict(
        env_file=".env",  # Load .env file if present
        env_file_encoding="utf-8",
        case_sensitive=True,  # Match environment variable names exactly
        extra="ignore",  # Ignore extra fields not defined in the model
    )


# Instantiate the settings object for easy import elsewhere
settings = Settings()
