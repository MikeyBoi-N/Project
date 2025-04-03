from fastapi import FastAPI

from .auth import router as auth_router # Import the auth router
# from .kappa import router as kappa_router # TODO: Uncomment when Kappa service is implemented
# from .djinn import router as djinn_router # TODO: Uncomment when Djinn service is implemented
# from .ghost import router as ghost_router # TODO: Uncomment when Ghost service is implemented
# from .tesseract import router as tesseract_router # TODO: Uncomment when Tesseract service is implemented
from .db.session import get_driver, close_driver # Import driver lifecycle functions
from contextlib import asynccontextmanager
import logging

# Configure basic logging
logging.basicConfig(level=logging.DEBUG) # Set level to DEBUG

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Neo4j driver
    logging.info("Application startup: Initializing Neo4j driver...")
    await get_driver()
    yield
    # Shutdown: Close Neo4j driver
    logging.info("Application shutdown: Closing Neo4j driver...")
    await close_driver()

app = FastAPI(
    title="Selkie Backend API",
    description="API services for the Selkie project (Kappa, Djinn, Ghost, Tesseract)",
    version="0.1.0",
    lifespan=lifespan # Add the lifespan context manager
)

@app.get("/health", tags=["Health Check"])
async def health_check():
    """
    Simple health check endpoint.
    """
    return {"status": "ok"}

# Add routers for different modules (Auth, Kappa, etc.) later
app.include_router(auth_router.router) # Include the authentication router
# TODO: Add routers for Kappa, etc. later
# app.include_router(kappa_router.router) # TODO: Uncomment when Kappa service is implemented
# app.include_router(djinn_router.router) # TODO: Uncomment when Djinn service is implemented
# app.include_router(ghost_router.router) # TODO: Uncomment when Ghost service is implemented
# app.include_router(tesseract_router.router) # TODO: Uncomment when Tesseract service is implemented

if __name__ == "__main__":
    # This block is for running locally without uvicorn command, useful for debugging
    # Not typically used when running with Docker/uvicorn command
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)