import uuid  # For generating unique user IDs if needed
from datetime import datetime, timezone
from typing import Optional

from neo4j import ManagedTransaction

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
        if "user_id" in user_data:
            user_data["id"] = user_data.pop("user_id")
        else:
            # Fallback or raise error if no consistent ID found
            # For now, let's assume element_id is acceptable if no user_id
            user_data["id"] = record["u"].element_id

        # Ensure all fields expected by UserInDB are present, potentially with None
        # This mapping might need adjustment based on actual node properties
        return schemas.UserInDB(
            id=user_data.get("id"),
            email=user_data.get("email"),
            name=user_data.get("name"),
            hashed_password=user_data.get("hashed_password"),
            google_id=user_data.get("google_id"),
            # Add other fields as needed
        )
    return None


def create_user(tx: ManagedTransaction, user: schemas.UserCreate) -> schemas.UserInDB:
    """Creates a new user in the database."""
    hashed_password = security.get_password_hash(user.password)
    user_id = str(uuid.uuid4())  # Generate a unique ID for the user
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
        created_at=timestamp,
    )
    record = result.single()
    if record and record["u"]:
        created_user_data = dict(record["u"])
        # Map Neo4j node properties to the UserInDB schema
        return schemas.UserInDB(
            id=created_user_data.get("user_id"),  # Use the generated user_id
            email=created_user_data.get("email"),
            name=created_user_data.get("name"),
            hashed_password=created_user_data.get("hashed_password"),
            google_id=None,  # Not set during email/password registration
        )
    else:
        # Handle error: User creation failed unexpectedly
        # This part should ideally not be reached if the CREATE query succeeds
        raise Exception("Failed to create user node in database.")


# Add other CRUD functions as needed (e.g., update_user, get_user_by_id)


def get_user_by_google_id(
    tx: ManagedTransaction, google_id: str
) -> Optional[schemas.UserInDB]:
    """Retrieves a user from the database by Google ID."""
    query = "MATCH (u:User {google_id: $google_id}) RETURN u"
    result = tx.run(query, google_id=google_id)
    record = result.single()
    if record and record["u"]:
        user_data = dict(record["u"])
        # Ensure 'id' is mapped correctly from 'user_id' property
        if "user_id" in user_data:
            user_data["id"] = user_data.pop("user_id")
        else:
            # Fallback or raise error if no consistent ID found
            user_data["id"] = record["u"].element_id  # Or handle error

        # Map to UserInDB schema
        return schemas.UserInDB(
            id=user_data.get("id"),
            email=user_data.get("email"),
            name=user_data.get("name"),
            hashed_password=user_data.get("hashed_password"),
            google_id=user_data.get("google_id"),
        )
    return None


def create_user_from_google(
    tx: ManagedTransaction, user_in: schemas.UserCreateGoogle
) -> schemas.UserInDB:
    """Creates a new user in the database from Google OAuth info."""
    user_id = str(uuid.uuid4())  # Generate a unique ID
    timestamp = datetime.now(timezone.utc).isoformat()

    query = (
        "CREATE (u:User { "
        "user_id: $user_id, "
        "email: $email, "
        "google_id: $google_id, "
        "name: $name, "
        "created_at: $created_at, "
        "hashed_password: null "  # No password for Google login initially
        "}) RETURN u"
    )
    result = tx.run(
        query,
        user_id=user_id,
        email=user_in.email,
        google_id=user_in.google_id,
        name=user_in.name,  # Assumes name might be provided
        created_at=timestamp,
    )
    record = result.single()
    if record and record["u"]:
        created_user_data = dict(record["u"])
        # Map Neo4j node properties to the UserInDB schema
        return schemas.UserInDB(
            id=created_user_data.get("user_id"),
            email=created_user_data.get("email"),
            name=created_user_data.get("name"),
            hashed_password=None,  # Explicitly None
            google_id=created_user_data.get("google_id"),
        )
    else:
        raise Exception("Failed to create user node from Google info in database.")


def link_google_id_to_user(
    tx: ManagedTransaction, user_id: str, google_id: str
) -> bool:
    """Links a Google ID to an existing user identified by user_id."""
    query = "MATCH (u:User {user_id: $user_id}) SET u.google_id = $google_id RETURN u"
    result = tx.run(query, user_id=user_id, google_id=google_id)
    summary = result.consume()  # Consume the result to get summary info
    # Check if any properties were set
    return summary.counters.properties_set > 0
