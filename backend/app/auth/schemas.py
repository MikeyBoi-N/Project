from pydantic import BaseModel, EmailStr
from typing import Optional

class Token(BaseModel):
    """Schema for the JWT access token."""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """Schema for data encoded within the JWT."""
    email: Optional[EmailStr] = None
    # Add other relevant user identifiers if needed, e.g., user_id

class UserBase(BaseModel):
    """Base schema for User properties."""
    email: EmailStr
    name: Optional[str] = None

class UserCreate(UserBase):
    """Schema for creating a new user via email/password."""
    password: str

class UserLogin(BaseModel):
    """Schema for user login via email/password."""
    email: EmailStr
    password: str

class UserInDBBase(UserBase):
    """Base schema for User properties stored in DB."""
    id: str # Assuming Neo4j node ID or a custom UUID
    hashed_password: Optional[str] = None
    google_id: Optional[str] = None

    class Config:
        from_attributes = True # Pydantic v2 way to handle ORM mode

class User(UserInDBBase):
    """Schema for representing a User object (e.g., for returning user info)."""
    pass # Inherits all fields from UserInDBBase

class UserInDB(UserInDBBase):
    """Schema representing the full User object as stored in the database."""
    pass # Inherits all fields from UserInDBBase