# backend/app/users/router.py
from fastapi import APIRouter, Depends
from typing import Annotated

from app.auth import schemas as auth_schemas
from app.auth.security import get_current_user_from_cookie

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    responses={404: {"description": "Not found"}},
)

# Define the dependency type hint for clarity
CurrentUser = Annotated[auth_schemas.User, Depends(get_current_user_from_cookie)]

@router.get("/me", response_model=auth_schemas.User)
async def read_users_me(current_user: CurrentUser):
    """
    Get current logged-in user's details.
    Requires authentication via JWT cookie.
    """
    # The dependency already fetches and validates the user.
    # We just need to return it.
    # Ensure the User schema doesn't expose sensitive info like hashed_password
    # (The current User schema inherits from UserInDBBase which includes it,
    # might need refinement later to exclude it for this endpoint if necessary)
    return current_user