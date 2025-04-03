from pydantic import BaseModel, Field
from typing import Optional, List, Tuple
from datetime import datetime
import uuid

# --- Image Schemas ---

class ImageBase(BaseModel):
    """Base schema for image metadata."""
    filename: str = Field(..., description="Original filename of the image")
    content_type: Optional[str] = Field(None, description="MIME type of the image")
    description: Optional[str] = Field(None, description="User-provided description")
    # Potential future fields: source_location (e.g., GeoJSON Point of camera)

class ImageCreate(ImageBase):
    """Schema used for creating an image entry."""
    pass # Inherits fields from ImageBase

class Image(ImageBase):
    """Schema representing an image stored in the system."""
    id: uuid.UUID = Field(..., description="Unique identifier for the image node in Neo4j")
    storage_uri: str = Field(..., description="URI/identifier for the image in Object Storage")
    created_at: datetime = Field(..., description="Timestamp when the image was ingested")
    updated_at: datetime = Field(..., description="Timestamp when the image metadata was last updated")
    # Optional: Add owner_id, detected_object_ids list

    class Config:
        from_attributes = True # Pydantic V2 setting

# --- Detected Object Schemas ---

class DetectedObjectBase(BaseModel):
    """Base schema for a detected object's properties."""
    object_class: str = Field(..., description="Classification label of the detected object (e.g., 'car', 'person')")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score from the detection model (0.0 to 1.0)")
    bounding_box: Optional[List[Tuple[float, float]]] = Field(None, description="Coordinates of the bounding box within the image (e.g., [[xmin, ymin], [xmax, ymax]] or polygon)")
    # CRUCIAL for map display:
    latitude: Optional[float] = Field(None, description="Estimated latitude of the detected object")
    longitude: Optional[float] = Field(None, description="Estimated longitude of the detected object")
    # How lat/lon is determined depends on implementation (e.g., from image metadata, external source, inference)

class DetectedObjectCreate(DetectedObjectBase):
    """Schema used when creating a detected object entry in the database."""
    image_id: uuid.UUID = Field(..., description="ID of the source image where the object was detected")

class DetectedObject(DetectedObjectBase):
    """Schema representing a detected object stored in the system."""
    id: uuid.UUID = Field(..., description="Unique identifier for the detected object node in Neo4j")
    image_id: uuid.UUID = Field(..., description="ID of the source image")
    created_at: datetime = Field(..., description="Timestamp when the detection was recorded")

    class Config:
        from_attributes = True # Pydantic V2 setting

class ImageDetectionResult(BaseModel):
    """Schema for returning the results of object detection on an image."""
    image: Image
    detected_objects: List[DetectedObject]