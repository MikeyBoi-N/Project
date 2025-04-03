from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

# --- Tesseract Scene Schemas ---

class TesseractSceneBase(BaseModel):
    """Base schema for Tesseract 3D scene metadata."""
    name: Optional[str] = Field(None, description="User-defined name for the scene")
    description: Optional[str] = Field(None, description="User-provided description of the scene")
    timestamp: datetime = Field(..., description="Timestamp relevant to the scene data (e.g., capture time)")

    # CRUCIAL for map display: The 2D footprint of the 3D scene
    # Using GeoJSON structure (Polygon or MultiPolygon) is recommended
    footprint_geojson: Optional[Dict[str, Any]] = Field(None, description="GeoJSON representation (Polygon or MultiPolygon) of the scene's 2D footprint on the map")

    # Metadata about the reconstruction process or source data
    source_data_description: Optional[str] = Field(None, description="Description of the source data used for reconstruction")
    reconstruction_parameters: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Parameters used during reconstruction")


class TesseractSceneCreate(TesseractSceneBase):
    """Schema used for creating a Tesseract scene entry.
    The actual scene data file (e.g., .splat) is handled separately during upload.
    """
    # Expect footprint_geojson to be provided on creation
    footprint_geojson: Dict[str, Any] = Field(..., description="GeoJSON representation (Polygon or MultiPolygon) of the scene's 2D footprint on the map")


class TesseractScene(TesseractSceneBase):
    """Schema representing a Tesseract scene stored in the system."""
    id: uuid.UUID = Field(..., description="Unique identifier for the Tesseract scene node in Neo4j")
    scene_data_storage_uri: str = Field(..., description="URI/identifier for the main scene data file (e.g., .splat) in Object Storage")
    # Optional: Add URIs for other related files if needed
    created_at: datetime = Field(..., description="Timestamp when the scene was logged into the system")
    updated_at: datetime = Field(..., description="Timestamp when the scene metadata was last updated")

    class Config:
        from_attributes = True # Pydantic V2 setting


# Schema for returning scene data location (used by viewer)
class TesseractSceneDataLocation(BaseModel):
    scene_id: uuid.UUID
    storage_uri: str
    # Add other relevant info if needed by the viewer