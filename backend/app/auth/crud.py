from neo4j import Driver, ManagedTransaction # Assuming driver session management
from typing import Optional
import uuid # For generating unique user IDs if needed
from datetime import datetime, timezone

from . import schemas, security

# Note: The 'db: Driver' or 'tx: ManagedTransaction' type hints are placeholders.
# The actual database session/transaction handling will depend on how we structure
# the database connection dependency injection in FastAPI.

def get_user_by_email(tx: ManagedTransaction, email: str) -> Optional[schemas.UserInDB]:
    """Retrieves a user from the database by email."""
    query = "MATCH (u:User {email: $email}) RETURN u"
    result = tx.run(query, email=email)
    record = result.single()
    if record and record["u"]:
        user_data = dict(record["u"])
        # Neo4j driver might return internal ID, ensure 'id' is consistent
        # If using element_id: user_data['id'] = record["u"].element_id
        # If using a custom 'user_id' property:
        if 'user_id' in user_data:
             user_data['id'] = user_data.pop('user_id')
        else:
             # Fallback or raise error if no consistent ID found
             # For now, let's assume element_id is acceptable if no user_id
             user_data['id'] = record["u"].element_id

        # Ensure all fields expected by UserInDB are present, potentially with None
        # This mapping might need adjustment based on actual node properties
        return schemas.UserInDB(
            id=user_data.get('id'),
            email=user_data.get('email'),
            name=user_data.get('name'),
            hashed_password=user_data.get('hashed_password'),
            google_id=user_data.get('google_id')
            # Add other fields as needed
        )
    return None

def create_user(tx: ManagedTransaction, user: schemas.UserCreate) -> schemas.UserInDB:
    """Creates a new user in the database."""
    hashed_password = security.get_password_hash(user.password)
    user_id = str(uuid.uuid4()) # Generate a unique ID for the user
    timestamp = datetime.now(timezone.utc).isoformat()

    query = (
        "CREATE (u:User { "
        "user_id: $user_id, "
        "email: $email, "
        "hashed_password: $hashed_password, "
        "name: $name, "
        "created_at: $created_at "
        "}) RETURN u"
    )
    result = tx.run(
        query,
        user_id=user_id,
        email=user.email,
        hashed_password=hashed_password,
        name=user.name,
        created_at=timestamp
    )
    record = result.single()
    if record and record["u"]:
        created_user_data = dict(record["u"])
        # Map Neo4j node properties to the UserInDB schema
        return schemas.UserInDB(
            id=created_user_data.get('user_id'), # Use the generated user_id
            email=created_user_data.get('email'),
            name=created_user_data.get('name'),
            hashed_password=created_user_data.get('hashed_password'),
            google_id=None # Not set during email/password registration
        )
    else:
        # Handle error: User creation failed unexpectedly
        # This part should ideally not be reached if the CREATE query succeeds
        raise Exception("Failed to create user node in database.")

# Add other CRUD functions as needed (e.g., update_user, get_user_by_id)