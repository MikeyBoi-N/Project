import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import EmailStr
from app.core.config import settings # Import centralized settings

# Configuration (Ideally load from environment variables)
# TODO: Move these to environment variables (.env file) and load them
# SECRET_KEY = os.getenv("SECRET_KEY", "a_very_secret_key_that_should_be_changed") # Now in settings
# ALGORITHM = os.getenv("ALGORITHM", "HS256")
 # Now in settings
# ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
 # Now in settings

# Password Hashing Context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hashes a plain password."""
    return pwd_context.hash(password)

# --- JWT Handling Functions (to be added next) ---

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Creates a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    # Ensure the subject ('sub') is present in the data
    if "sub" not in to_encode:
        raise ValueError("Subject ('sub') key missing from token data")
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """
    Decodes a JWT access token.
    Returns the payload dictionary if valid, None otherwise.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        # Optionally add more validation here (e.g., check 'iss', 'aud')
        # Check if token has expired (though jwt.decode usually handles this)
        if "exp" in payload and datetime.fromtimestamp(payload["exp"], tz=timezone.utc) < datetime.now(timezone.utc):
             return None # Explicitly check expiration
        return payload
    except JWTError:
        # Covers invalid signature, expired token (if not caught above), malformed token, etc.)
         return None