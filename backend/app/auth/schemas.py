from typing import Optional

from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    """Schema for the JWT access token."""

    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Schema for data encoded within the JWT."""

    email: Optional[EmailStr] = None
    # Add other relevant user identifiers if needed, e.g., user_id
    user_id: Optional[str] = None  # Add user ID


class UserBase(BaseModel):
    """Base schema for User properties."""

    email: EmailStr
    name: Optional[str] = None


class UserCreate(UserBase):
    """Schema for creating a new user via email/password."""

    password: str


class UserCreateGoogle(UserBase):
    """Schema for creating a user from Google OAuth info."""

    google_id: str


class UserLogin(BaseModel):
    """Schema for user login via email/password."""

    email: EmailStr
    password: str


class UserInDBBase(UserBase):
    """Base schema for User properties stored in DB."""

    id: str  # Assuming Neo4j node ID or a custom UUID
    hashed_password: Optional[str] = None
    google_id: Optional[str] = None

    class Config:
        from_attributes = True  # Pydantic v2 way to handle ORM mode


class User(UserInDBBase):
    """Schema for representing a User object (e.g., for returning user info)."""

    pass  # Inherits all fields from UserInDBBase


class UserInDB(UserInDBBase):
    """Schema representing the full User object as stored in the database."""

    pass  # Inherits all fields from UserInDBBase
