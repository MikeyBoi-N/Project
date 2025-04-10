from typing import Any, Dict, List

from pydantic import BaseModel, Field


class MapViewDetectionRequest(BaseModel):
    """
    Request model for detecting objects in a map view image.
    """

    image_data: str = Field(..., description="Base64 encoded image data string.")
    bounds: Dict[str, float] = Field(
        ...,
        description="Dictionary representing the geographic bounds of the image (e.g., {'north': lat, 'south': lat, 'east': lon, 'west': lon}).",
    )


class DetectionResult(BaseModel):
    """
    Represents a single detected object.
    Placeholder for now.
    """

    label: str
    confidence: float
    box: List[float]  # Example: [xmin, ymin, xmax, ymax]


class MapViewDetectionResponse(BaseModel):
    """
    Response model for map view object detection.
    Returns a list of detected objects.
    """

    detections: List[DetectionResult] = Field(
        default_factory=list, description="List of detected objects."
    )
