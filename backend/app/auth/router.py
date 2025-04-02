from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated # Use Annotated for Depends syntax in newer FastAPI/Python
from neo4j import AsyncManagedTransaction # Import the correct type hint

from . import schemas, crud, security
from app.db.session import get_db_transaction # Import the actual dependency

# Placeholder for database session dependency - Replace with actual implementation later
# This function would typically get a Neo4j driver instance and manage a session/transaction
async def get_db_session(): # Or get_db_transaction
    # In a real app, this would yield a Neo4j session or transaction
    # For now, it does nothing, CRUD functions expect a transaction object
    # We'll need to integrate this with the actual Neo4j driver setup
    print("Warning: Using placeholder get_db_session. Neo4j connection not implemented yet.")
    # Example structure (needs actual driver):
    # driver: Driver = get_neo4j_driver() # Get driver instance
    # async with driver.session() as session:
    #     yield session # Or yield session.begin_transaction() if managing transactions here
    yield None # Placeholder yield

# Type hint for the actual dependency result
DbTxn = Annotated[AsyncManagedTransaction, Depends(get_db_transaction)]

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
    responses={404: {"description": "Not found"}},
)

@router.post("/register", response_model=schemas.User)
async def register_user(user: schemas.UserCreate, tx: DbTxn):
    """
    Registers a new user with email and password.
    """
    # No need to check for None anymore, dependency handles connection errors

    # Use the transaction object directly with CRUD functions
    # Note: CRUD functions might need adjustment if they weren't designed for AsyncManagedTransaction
    db_user = await crud.get_user_by_email(tx, email=user.email)
 # Pass tx directly
    # Note: Neo4j driver operations might be synchronous depending on the driver version
    # and how it's used. Adjust async/await if using a sync driver/method.
    # Assuming crud functions can be adapted or wrapped for async context if needed.
    # For simplicity here, assuming execute_read/write handle async if necessary.

    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    created_user = await crud.create_user(tx, user=user)
 # Pass tx directly
    return created_user


@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    tx: DbTxn
):
    """
    Provides an access token for a user logging in with email (username) and password.
    Uses OAuth2PasswordRequestForm, so frontend should send 'username' and 'password'.
    """
    if tx is None: # Check if placeholder dependency returned None
         raise HTTPException(status_code=500, detail="Database connection not available")

    user = await crud.get_user_by_email(tx, email=form_data.username) # Pass tx directly

    if not user or not user.hashed_password or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create JWT token
    access_token = security.create_access_token(
        data={"sub": user.email} # Use email as the subject ('sub')
        # Add other claims if needed, e.g., user_id: user.id
    )
    return {"access_token": access_token, "token_type": "bearer"}

# TODO: Add endpoints for Google OAuth flow (/auth/google/login, /auth/google/callback)