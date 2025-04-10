import uuid
from typing import Any, Dict, List  # Added List, Dict

from fastapi import APIRouter  # Moved status import here for clarity
from fastapi import HTTPException, status

# Import schemas and utility/inference functions
from app.schemas.djinn import (
    DjinnDetectionResponse,
    DjinnDetectionResult,
    DjinnMapViewRequest,
)
from app.services.djinn.inference.detection import run_yolo_detection
from app.services.djinn.utils.image_processing import (
    convert_pixel_to_geo,
    decode_base64_image,
)

router = APIRouter()


@router.post(
    "/detect_map_view",
    response_model=DjinnDetectionResponse,
    summary="Detect Objects in Map View Image",
    description="Receives a base64 encoded image of a map view and its geographic bounds, performs object detection (placeholder), and returns detected objects.",
    status_code=status.HTTP_200_OK,
)
async def detect_objects_in_map_view(
    request_data: DjinnMapViewRequest,
) -> DjinnDetectionResponse:
    """
    Receives a base64 encoded map view image and its geographic bounds,
    performs object detection, converts pixel coordinates to geographic
    coordinates, and returns the detected objects with their locations.
    """
    # 1. Decode Image
    image_np = decode_base64_image(request_data.image_data)
    if image_np is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or corrupt base64 image data provided.",
        )

    # 2. Get Image Dimensions
    img_height, img_width = image_np.shape[:2]
    if img_height == 0 or img_width == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Decoded image has zero dimensions.",
        )

    # 3. Run Detection
    try:
        # Assuming run_yolo_detection returns a list of dicts like:
        # [{'bbox_pixels': [x1, y1, x2, y2], 'confidence': 0.95, 'class_name': 'car'}, ...]
        raw_detections: List[Dict[str, Any]] = run_yolo_detection(image_np)
    except Exception as e:
        # Log the exception e
        print(f"Error during YOLO detection: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Object detection failed.",
        )

    # 4. Process & Convert Results
    formatted_detections: List[DjinnDetectionResult] = []
    for detection in raw_detections:
        try:
            bbox_pixels = detection.get("bbox_pixels")
            confidence = detection.get("confidence")
            class_name = detection.get("class_name")

            # Ensure all necessary data is present
            if not all([bbox_pixels, isinstance(confidence, (float, int)), class_name]):
                print(f"Skipping detection with missing/invalid data: {detection}")
                continue  # Skip this detection if data is incomplete

            # Validate bbox format if needed (e.g., length 4)
            if len(bbox_pixels) != 4:
                print(f"Skipping detection with invalid bbox: {bbox_pixels}")
                continue

            # Calculate center pixel coordinates
            center_px = (bbox_pixels[0] + bbox_pixels[2]) / 2
            center_py = (bbox_pixels[1] + bbox_pixels[3]) / 2

            # Convert pixel coordinates to geographic coordinates
            lat, lng = convert_pixel_to_geo(
                px=center_px,
                py=center_py,
                image_width=img_width,
                image_height=img_height,
                bounds=request_data.bounds,
            )

            # Generate a unique ID for the detection
            detection_id = str(uuid.uuid4())

            # Create the final detection result object
            # Note: The schema expects location as a nested model, but the prompt
            # asked for a dict. Creating the dict as requested. If the schema
            # requires a GeoPoint model, this should be adjusted.
            formatted_detection = DjinnDetectionResult(
                id=detection_id,
                class_name=str(class_name),  # Ensure class_name is string
                confidence=float(confidence),  # Ensure confidence is float
                location={"lat": lat, "lng": lng},  # As per prompt requirement
            )
            formatted_detections.append(formatted_detection)

        except Exception as e:
            # Log the exception e for the specific detection
            print(f"Error processing detection {detection}: {e}")
            # Decide whether to skip this detection or raise an error
            # For now, we'll skip it and log
            continue

    # 5. Return Response
    return DjinnDetectionResponse(detections=formatted_detections)


# Add other Djinn-related endpoints here as needed
