from fastapi import APIRouter, Depends, HTTPException, status
from fastapi import Request, Response # Add Request and Response
from fastapi.responses import RedirectResponse # Add RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated # Use Annotated for Depends syntax in newer FastAPI/Python
from authlib.integrations.starlette_client import OAuth # Add OAuth
import uuid # For potential state generation if needed, though Authlib handles it
from neo4j import AsyncManagedTransaction # Import the correct type hint

from . import schemas, crud, security
from app.db.session import get_db_transaction # Import the actual dependency
from app.core.config import settings # Import settings

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


# Initialize OAuth client (outside routes)
oauth = OAuth()
oauth.register(
    name='google',
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile' # Request necessary scopes
    }
)

# New Routes
@router.get("/google/login")
async def login_via_google(request: Request):
    """
    Redirects the user to Google's OAuth 2.0 server for authentication.
    """
    # The redirect URI must match *exactly* one of the authorized redirect URIs
    # configured in the Google Cloud Console for your OAuth client ID.
    redirect_uri = settings.GOOGLE_REDIRECT_URI # Use configured redirect URI
    # Authlib handles state generation and verification automatically
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/google/callback", response_class=RedirectResponse)
async def google_auth_callback(request: Request, tx: DbTxn):
    """
    Handles the callback from Google after user authentication.
    Finds or creates the user, generates a JWT, sets it in a cookie,
    and redirects back to the frontend.
    """
    try:
        # Exchange authorization code for access token and user info
        token = await oauth.google.authorize_access_token(request)
        user_info = await oauth.google.parse_id_token(request, token)
        # Or use: user_info = await oauth.google.userinfo(token=token)

        google_id = user_info.get('sub')
        email = user_info.get('email')

        if not google_id or not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not retrieve Google ID or email from Google.",
            )

        # --- Find or Create User ---
        # 1. Try finding user by Google ID
        user = await crud.get_user_by_google_id(tx, google_id=google_id) # Needs implementation in crud.py

        if not user:
            # 2. Try finding user by email (if not found by google_id)
            user = await crud.get_user_by_email(tx, email=email)
            if user:
                # 2a. User exists by email, link Google ID
                # Ensure user object has an 'id' attribute accessible here
                await crud.link_google_id_to_user(tx, user_id=user.id, google_id=google_id) # Needs implementation in crud.py
            else:
                # 3. User not found, create new user from Google info
                # Ensure schemas.UserCreateGoogle exists or adapt
                user_create_google = schemas.UserCreateGoogle(
                    email=email,
                    google_id=google_id,
                    # Potentially add other fields like first_name, last_name if available and needed
                    # name=user_info.get('name')
                )
                user = await crud.create_user_from_google(tx, user_in=user_create_google) # Needs implementation in crud.py

        if not user: # Should not happen if create_user worked, but safety check
             raise HTTPException(status_code=500, detail="Could not retrieve or create user.")

        # --- Generate JWT and Set Cookie ---
        # Ensure user object has 'email' and 'id' attributes accessible here
        access_token = security.create_access_token(
            data={"sub": user.email, "user_id": str(user.id)} # Include user ID if available and useful
        )

        # Redirect to frontend, setting the token in an HTTP-only cookie
        # TODO: Define frontend URL in settings?
        frontend_url = "/" # Example: Redirect to homepage
        response = RedirectResponse(url=frontend_url)
        response.set_cookie(
            key="access_token",
            value=f"Bearer {access_token}",
            httponly=True,
            secure=True, # Set secure=True for HTTPS only
            samesite="lax", # Or 'strict' depending on needs
            path="/", # Cookie available for all paths
            # max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60 # Optional: set cookie expiry
        )
        return response

    except Exception as e:
        # Log the error for debugging
        print(f"Error during Google OAuth callback: {e}") # Replace with proper logging
        # Redirect to a frontend error page or login page with an error message
        # TODO: Define frontend error URL?
        error_url = "/login?error=oauth_failed"
        return RedirectResponse(url=error_url)


@router.post("/logout")
async def logout(response: Response):
    """
    Clears the access_token cookie to log the user out.
    """
    response.delete_cookie(
        key="access_token",
        path="/", # Ensure path matches the one used for setting the cookie
        httponly=True,
        secure=True, # Match secure flag used when setting
        samesite="lax" # Match samesite flag used when setting
    )
    # Optionally return a confirmation message
    return {"message": "Successfully logged out"}

# TODO: Implement /users/me and JWT cookie dependency (Partially done via /users/me router)
# TODO: Add protected endpoint example
# TODO: Implement /users/me, /auth/logout, and JWT cookie dependency
# TODO: Add endpoints for Google OAuth flow (/auth/google/login, /auth/google/callback)