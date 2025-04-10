import base64
import logging
from typing import Dict, Optional, Tuple, Union

import cv2
import numpy as np

logger = logging.getLogger(__name__)


def decode_base64_image(image_data: str) -> Optional[np.ndarray]:
    """
    Decodes a base64 encoded image string into an OpenCV NumPy array (BGR format).

    Args:
        image_data: The base64 encoded image string, potentially with a
                    data URI prefix (e.g., "data:image/png;base64,").

    Returns:
        A NumPy array representing the decoded image in BGR format,
        or None if decoding fails.
    """
    try:
        # Remove potential data URI prefix
        if "," in image_data:
            header, encoded_data = image_data.split(",", 1)
        else:
            encoded_data = image_data

        # Decode base64
        image_bytes = base64.b64decode(encoded_data)

        # Convert bytes to NumPy array using OpenCV
        image_np = np.frombuffer(image_bytes, np.uint8)
        image_cv = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

        if image_cv is None:
            logger.error("Failed to decode image data with OpenCV.")
            return None

        return image_cv
    except base64.binascii.Error as e:
        logger.error(f"Invalid base64 data: {e}")
        return None
    except Exception as e:
        logger.error(f"An unexpected error occurred during image decoding: {e}")
        return None


def convert_pixel_to_geo(
    px: float, py: float, img_width: int, img_height: int, bounds: Dict
) -> Tuple[float, float]:
    """
    Converts pixel coordinates (x, y) within an image to geographic
    coordinates (latitude, longitude) based on the image dimensions and
    geographic bounds.

    Args:
        px: The x-coordinate of the pixel (horizontal position).
        py: The y-coordinate of the pixel (vertical position).
        img_width: The total width of the image in pixels.
        img_height: The total height of the image in pixels.
        bounds: A dictionary containing the geographic bounds, expected keys:
                '_southWest': {'lat': float, 'lng': float}
                '_northEast': {'lat': float, 'lng': float}

    Returns:
        A tuple containing the calculated (latitude, longitude).

    Raises:
        ValueError: If the bounds dictionary is missing required keys or
                    if image dimensions are non-positive.
    """
    if img_width <= 0 or img_height <= 0:
        raise ValueError("Image width and height must be positive.")

    try:
        lat_min = bounds["_southWest"]["lat"]
        lng_min = bounds["_southWest"]["lng"]
        lat_max = bounds["_northEast"]["lat"]
        lng_max = bounds["_northEast"]["lng"]
    except KeyError as e:
        raise ValueError(f"Bounds dictionary is missing required key: {e}")
    except TypeError:
        raise ValueError("Bounds dictionary has an invalid structure.")

    # Ensure coordinates are within image bounds (optional, but good practice)
    px = max(0, min(px, img_width))
    py = max(0, min(py, img_height))

    geo_width = lng_max - lng_min
    geo_height = lat_max - lat_min

    # Perform linear interpolation
    # Longitude increases from left (lng_min) to right (lng_max)
    lng = lng_min + (px / img_width) * geo_width

    # Latitude decreases from top (lat_max) to bottom (lat_min) in image coordinates
    lat = lat_max - (py / img_height) * geo_height

    return lat, lng
