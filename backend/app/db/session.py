import asyncio  # Import asyncio for sleep
import logging
from typing import AsyncGenerator

from neo4j import AsyncDriver, AsyncGraphDatabase, AsyncManagedTransaction
from neo4j.exceptions import ServiceUnavailable  # Import specific exception

from app.core.config import settings

# Global variable to hold the driver instance
_driver: AsyncDriver | None = None


async def get_driver() -> AsyncDriver:
    """
    Initializes and returns the Neo4j AsyncDriver instance.
    Uses connection details from settings.
    """
    MAX_RETRIES = 5
    RETRY_DELAY_SECONDS = 3
    global _driver
    if _driver is None:
        for attempt in range(MAX_RETRIES):
            try:
                logging.info(
                    f"Attempting to connect to Neo4j at {settings.NEO4J_URI} with user {settings.NEO4J_USER} (Attempt {attempt + 1}/{MAX_RETRIES})"
                )
                # Log the password being used (mask partially for security in logs if needed, but for debugging let's see it)
                logging.debug(f"Using Neo4j URI: {settings.NEO4J_URI}")
                logging.debug(f"Using Neo4j User: {settings.NEO4J_USER}")
                logging.debug(f"Using Neo4j Password: {settings.NEO4J_PASSWORD}")
                auth_tuple = (settings.NEO4J_USER, settings.NEO4J_PASSWORD)
                logging.debug(f"Auth tuple passed to driver: {auth_tuple}")
                temp_driver = AsyncGraphDatabase.driver(
                    settings.NEO4J_URI, auth=auth_tuple
                )
                await temp_driver.verify_connectivity()  # Check connection on startup
                _driver = temp_driver  # Assign to global only if connection successful
                logging.info("Neo4j driver initialized and connected.")
                break  # Exit loop if connection successful
            except ServiceUnavailable as e:
                logging.warning(
                    f"Neo4j connection attempt {attempt + 1} failed: {e}. Retrying in {RETRY_DELAY_SECONDS} seconds..."
                )
                if attempt + 1 == MAX_RETRIES:
                    logging.error(
                        "Max retries reached. Failed to initialize Neo4j driver."
                    )
                    raise RuntimeError(
                        "Could not connect to Neo4j database after multiple attempts."
                    ) from e
                await asyncio.sleep(RETRY_DELAY_SECONDS)
            except Exception as e:  # Catch other potential driver errors
                logging.error(
                    f"An unexpected error occurred during Neo4j driver initialization: {e}"
                )
                raise RuntimeError(
                    "Could not connect to Neo4j database due to an unexpected error."
                ) from e

        if (
            _driver is None
        ):  # Should be caught by the retry loop exception, but as a safeguard
            raise RuntimeError("Neo4j driver initialization failed.")

    return _driver


async def close_driver():
    """Closes the Neo4j driver connection."""
    global _driver
    if _driver is not None:
        await _driver.close()
        _driver = None
        logging.info("Neo4j driver closed.")


async def get_db_transaction() -> AsyncGenerator[AsyncManagedTransaction, None]:
    """
    FastAPI dependency that provides a Neo4j managed transaction.
    Ensures the transaction is properly handled (committed or rolled back).
    """
    driver = await get_driver()
    async with driver.session() as session:
        async with session.begin_transaction() as tx:
            try:
                yield tx
                # If the endpoint function completes without raising an exception,
                # the transaction will be automatically committed upon exiting the 'with' block.
            except Exception:
                # If an exception occurs in the endpoint, the transaction will be
                # automatically rolled back upon exiting the 'with' block.
                # Re-raise the exception so FastAPI can handle it.
                raise
