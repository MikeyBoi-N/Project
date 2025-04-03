import uuid
from datetime import datetime, timezone
import logging
from neo4j import AsyncDriver # Use AsyncDriver for FastAPI

from . import schemas # Import schemas from the current kappa module

logger = logging.getLogger(__name__)

# --- Document CRUD Operations ---

async def create_document(driver: AsyncDriver, document_in: schemas.DocumentCreate, storage_uri: str) -> schemas.Document:
    """
    Creates a Document node in Neo4j with its metadata.

    Args:
        driver: The asynchronous Neo4j driver instance.
        document_in: Pydantic schema containing document metadata.
        storage_uri: The URI/identifier for the document in object storage.

    Returns:
        The created Document object including database-generated fields.

    Raises:
        Exception: If the database operation fails.
    """
    document_id = uuid.uuid4()
    now = datetime.now(timezone.utc)

    query = """
    CREATE (d:Document {
        id: $id,
        filename: $filename,
        content_type: $content_type,
        description: $description,
        storage_uri: $storage_uri,
        created_at: $created_at,
        updated_at: $updated_at
    })
    RETURN d.id AS id, d.filename AS filename, d.content_type AS content_type,
           d.description AS description, d.storage_uri AS storage_uri,
           d.created_at AS created_at, d.updated_at AS updated_at
    """
    parameters = {
        "id": str(document_id),
        "filename": document_in.filename,
        "content_type": document_in.content_type,
        "description": document_in.description,
        "storage_uri": storage_uri,
        "created_at": now,
        "updated_at": now,
    }

    logger.debug(f"Executing query to create document node: {query} with params: {parameters}")

    try:
        # Neo4j recommends using managed transactions (execute_write)
        async with driver.session() as session:
            result = await session.execute_write(
                lambda tx: tx.run(query, parameters).single()
            )

        if result:
            # Manually construct the Pydantic model from the result record
            created_doc_data = dict(result)
            # Ensure UUID and datetime types are correctly handled if necessary
            created_doc_data['id'] = uuid.UUID(created_doc_data['id'])
            # Neo4j driver might return datetime objects directly, adjust if needed
            # created_doc_data['created_at'] = ...
            # created_doc_data['updated_at'] = ...
            logger.info(f"Successfully created document node with ID: {created_doc_data['id']}")
            return schemas.Document(**created_doc_data)
        else:
            logger.error("Document node creation query did not return a result.")
            raise Exception("Failed to create document node in Neo4j.")

    except Exception as e:
        logger.error(f"Error creating document node in Neo4j: {e}", exc_info=True)
        # Re-raise the exception to be handled by the calling route
        raise e


async def search_documents(driver: AsyncDriver, query: str, limit: int = 10, skip: int = 0) -> list[schemas.Document]:
    """
    Searches for Document nodes in Neo4j based on a simple keyword match
    against filename or description (case-insensitive).
    NOTE: This is a very basic search. Full-text indexing would be needed for real-world use.

    Args:
        driver: The asynchronous Neo4j driver instance.
        query: The search term.
        limit: Maximum number of results to return.
        skip: Number of results to skip (for pagination).

    Returns:
        A list of matching Document objects.

    Raises:
        Exception: If the database operation fails.
    """
    # Basic case-insensitive search on filename and description
    # WARNING: This query will be slow on large datasets without indexes!
    # Consider creating indexes on :Document(filename) and :Document(description)
    # For real search, use Neo4j's full-text search capabilities.
    search_query = """
    MATCH (d:Document)
    WHERE toLower(d.filename) CONTAINS toLower($query) OR
          (d.description IS NOT NULL AND toLower(d.description) CONTAINS toLower($query))
    RETURN d.id AS id, d.filename AS filename, d.content_type AS content_type,
           d.description AS description, d.storage_uri AS storage_uri,
           d.created_at AS created_at, d.updated_at AS updated_at
    ORDER BY d.created_at DESC
    SKIP $skip
    LIMIT $limit
    """
    parameters = {"query": query, "skip": skip, "limit": limit}

    logger.debug(f"Executing query to search documents: {search_query} with params: {parameters}")

    documents = []
    try:
        async with driver.session() as session:
            result = await session.execute_read(
                lambda tx: tx.run(search_query, parameters).data()
            )

        for record in result:
            doc_data = dict(record)
            doc_data['id'] = uuid.UUID(doc_data['id'])
            documents.append(schemas.Document(**doc_data))

        logger.info(f"Found {len(documents)} documents matching query '{query}' (limit {limit}, skip {skip})")
        return documents

    except Exception as e:
        logger.error(f"Error searching documents in Neo4j for query '{query}': {e}", exc_info=True)
        raise e

# TODO: Implement count_search_results function for pagination metadata
# TODO: Consider adding functions to get a single document by ID, update, delete etc.