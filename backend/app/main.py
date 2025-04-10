import logging
from contextlib import asynccontextmanager
from typing import List, Optional, Tuple

from fastapi import Depends  # Add Depends
from fastapi import FastAPI
from pydantic import BaseModel

from .auth import router as auth_router  # Import the auth router
from .auth import schemas as auth_schemas  # Import auth schemas
from .auth.security import \
    get_current_user_from_cookie  # Import the dependency
from .db.session import (close_driver,  # Import driver lifecycle functions
                         get_driver)
from .djinn import router as djinn_router
from .ghost import router as ghost_router
from .kappa import router as kappa_router
from .tesseract import router as tesseract_router
from .users import router as users_router  # Import the users router

# Configure basic logging
logging.basicConfig(level=logging.DEBUG)  # Set level to DEBUG


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
    lifespan=lifespan,  # Add the lifespan context manager
)


@app.get("/health", tags=["Health Check"])
async def health_check():
    """
    Simple health check endpoint.
    """
    return {"status": "ok"}


# --- Map Data Schemas (Temporary Location) ---
class MapMarkerData(BaseModel):
    id: str
    position: Tuple[float, float]  # [latitude, longitude]
    popupContent: str
    source: Optional[str] = None


class MapDataResponse(BaseModel):
    markers: List[MapMarkerData]
    footprints: List[dict]  # Representing GeoJSON Polygon/MultiPolygon features


# --- Map Data Endpoint (MVP) ---
@app.get("/mapdata", response_model=MapDataResponse, tags=["Map Data"])
async def get_map_data():
    """
    Provides initial/placeholder geospatial data for the Shared Map Component.
    In later phases, this will aggregate data from Kappa, Djinn, Ghost, Tesseract.
    """
    logger.info("Request received for /mapdata")
    # TODO: Replace with actual data fetching and aggregation logic
    placeholder_markers = [
        MapMarkerData(
            id="test-1",
            position=[51.505, -0.09],
            popupContent="Test Marker 1 (London)",
            source="test",
        ),
        MapMarkerData(
            id="test-2",
            position=[51.51, -0.1],
            popupContent="Test Marker 2 (Near London)",
            source="test",
        ),
        # Example of how Kappa data might look (if location is stored)
        # MapMarkerData(id='kappa-doc-xyz', position=[51.515, -0.08], popupContent='Document: Report XYZ', source='kappa'),
        # Example of how Djinn data might look
        MapMarkerData(
            id="djinn-obj-1",
            position=[51.508, -0.11],
            popupContent="Detected Object: Car (Confidence: 0.95)",
            source="djinn",
        ),
        MapMarkerData(
            id="djinn-obj-2",
            position=[51.500, -0.07],
            popupContent="Detected Object: Person (Confidence: 0.88)",
            source="djinn",
        ),
        # Example of how Ghost data might look
        MapMarkerData(
            id="ghost-sig-1",
            position=[51.512, -0.12],
            popupContent="Signal Event: Freq 101.1 MHz",
            source="ghost",
        ),
    ]
    # Example Tesseract Footprint (GeoJSON Polygon)
    placeholder_footprints = [
        {
            "type": "Feature",
            "properties": {
                "scene_id": "tesseract-scene-1",
                "name": "Sample Scene Footprint",
                "source": "tesseract",
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [-0.15, 51.52],  # Top-left
                        [-0.10, 51.52],  # Top-right
                        [-0.10, 51.50],  # Bottom-right
                        [-0.15, 51.50],  # Bottom-left
                        [-0.15, 51.52],  # Close loop
                    ]
                ],
            },
        }
    ]
    return MapDataResponse(
        markers=placeholder_markers, footprints=placeholder_footprints
    )


# Add routers for different modules (Auth, Kappa, etc.) later
app.include_router(auth_router.router)  # Include the authentication router
# TODO: Add routers for Kappa, etc. later
app.include_router(kappa_router.router)
app.include_router(djinn_router.router)
app.include_router(ghost_router.router)
app.include_router(tesseract_router.router)
app.include_router(users_router.router)  # Include the users router


# --- Protected Endpoint Example ---
@app.get("/protected", response_model=dict, tags=["Example Protected Route"])
async def read_protected_route(
    current_user: auth_schemas.User = Depends(get_current_user_from_cookie),
):
    """
    An example protected route that requires authentication via JWT cookie.
    Returns a message including the logged-in user's email.
    """
    return {
        "message": f"Hello {current_user.email}, you have accessed a protected route!"
    }


if __name__ == "__main__":
    # This block is for running locally without uvicorn command, useful for debugging
    # Not typically used when running with Docker/uvicorn command
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
