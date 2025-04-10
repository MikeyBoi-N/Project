# backend/app/services/djinn/inference/detection.py

import logging
from typing import Dict, List

import numpy as np
from ultralytics import YOLO

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Model Loading ---
# Load the model once when the module is imported to avoid reloading on every call.
MODEL_PATH = "yolov8n.pt"  # You can change this to yolov8s.pt, yolov8m.pt, etc.
model: YOLO | None = None

try:
    model = YOLO(MODEL_PATH)
    logger.info(f"Successfully loaded YOLO model from {MODEL_PATH}")
except Exception as e:
    logger.error(f"Error loading YOLO model from {MODEL_PATH}: {e}", exc_info=True)
    model = None  # Ensure model is None if loading fails


# --- Inference Function ---
def run_yolo_detection(image_np: np.ndarray) -> List[Dict]:
    """
    Performs object detection on a given image using the pre-loaded YOLOv8 model.

    Args:
        image_np: A NumPy array representing the input image (BGR format expected by OpenCV).

    Returns:
        A list of dictionaries, where each dictionary represents a detected object
        with keys: 'bbox_pixels', 'confidence', 'class_id', 'class_name'.
        Returns an empty list if the model failed to load or no objects are detected.
    """
    if model is None:
        logger.error("YOLO model is not loaded. Cannot perform detection.")
        return []

    detections: List[Dict] = []
    try:
        # Run prediction (verbose=False reduces console output)
        results = model.predict(image_np, verbose=False)

        # Check if results are valid and contain boxes
        if results and results[0].boxes and results[0].boxes.data is not None:
            # Process results - results[0].boxes.data contains [x1, y1, x2, y2, conf, cls]
            for box_data in results[0].boxes.data:
                # Ensure tensor is on CPU and convert to numpy for easier handling
                box_data_cpu = box_data.cpu().numpy()

                x1, y1, x2, y2, conf, cls = box_data_cpu

                # Get class name using the model's names dictionary
                class_name = (
                    model.names[int(cls)] if model.names else f"class_{int(cls)}"
                )

                detection = {
                    "bbox_pixels": [
                        float(x1),
                        float(y1),
                        float(x2),
                        float(y2),
                    ],  # Ensure coords are floats
                    "confidence": float(conf),
                    "class_id": int(cls),
                    "class_name": class_name,
                }
                detections.append(detection)
        else:
            logger.info("No detections found or results format unexpected.")

    except Exception as e:
        logger.error(f"Error during YOLO detection: {e}", exc_info=True)
        return []  # Return empty list on error during prediction/processing

    return detections


# Example usage (optional, for testing within the module)
if __name__ == "__main__":
    # This block will only execute when the script is run directly
    # You would need a sample image (e.g., loaded with OpenCV) to test
    logger.info(
        "Detection module loaded. Model should be loaded if no errors occurred."
    )
    # Example: Create a dummy black image (requires opencv-python)
    try:
        import cv2

        dummy_image = np.zeros((640, 640, 3), dtype=np.uint8)
        if model:
            logger.info("Running detection on a dummy image...")
            detected_objects = run_yolo_detection(dummy_image)
            logger.info(f"Detected objects: {len(detected_objects)}")
            if detected_objects:
                logger.info(f"First detection: {detected_objects[0]}")
        else:
            logger.warning("Model not loaded, skipping dummy image test.")
    except ImportError:
        logger.warning("cv2 not installed, cannot run dummy image test.")
    except Exception as e:
        logger.error(f"Error in example usage block: {e}", exc_info=True)
