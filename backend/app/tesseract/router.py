import logging
import uuid
from typing import Optional

from fastapi import APIRouter, Body, Depends, File, HTTPException, UploadFile, status
from neo4j import AsyncDriver

from ..auth.schemas import User
from ..auth.security import get_current_active_user

# Adjust imports based on actual project structure
from ..db.session import get_driver
from . import (
    crud,  # Import CRUD functions
    schemas,  # Import schemas from the current tesseract module
)

# from ..core.storage import upload_to_storage # TODO: Import storage utility when created

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/tesseract",
    tags=["Tesseract - 4D Spatio-Temporal Visualization"],
    # dependencies=[Depends(get_current_active_user)] # Add auth dependency later if needed globally
)


@router.post(
    "/scenes/upload",
    response_model=schemas.TesseractScene,
    status_code=status.HTTP_201_CREATED,
)
async def upload_tesseract_scene(
    # Scene metadata (including footprint) sent as JSON in the request body
    scene_metadata: schemas.TesseractSceneCreate = Body(...),
    # Scene data file (e.g., .splat) sent as a file upload
    scene_file: UploadFile = File(
        ..., description="Pre-processed Tesseract scene data file (e.g., .splat)"
    ),
    db_driver: AsyncDriver = Depends(get_driver),
    current_user: User = Depends(get_current_active_user),
):
    """
    Uploads a pre-processed Tesseract scene data file and its associated metadata
    (including the 2D footprint GeoJSON). Stores the file in object storage and
    metadata in the graph database.
    """
    logger.info(f"Received Tesseract scene upload request by user {current_user.email}")
    logger.debug(f"Scene metadata received: {scene_metadata.model_dump_json(indent=2)}")

    scene_data_storage_uri: Optional[str] = None

    # --- 1. Handle Scene Data File Upload ---
    if not scene_file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Scene data file is required.",
        )

    logger.info(f"Processing scene file: {scene_file.filename}")
    try:
        # TODO: Implement file upload logic using a storage utility
        # scene_data_storage_uri = await upload_to_storage(scene_file, bucket_name="tesseract-scenes")
        # For now, using a placeholder
        scene_data_storage_uri = (
            f"minio:tesseract-scenes/{uuid.uuid4()}_{scene_file.filename}"
        )
        logger.debug(
            f"Placeholder scene data storage URI generated: {scene_data_storage_uri}"
        )
    except Exception as e:
        logger.error(
            f"Failed to upload scene file {scene_file.filename} to storage: {e}",
            exc_info=True,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not upload scene data file to storage.",
        )

    # --- 2. Create Scene Metadata in Graph Database (Neo4j) ---
    try:
        # Call CRUD function
        created_scene = await crud.create_tesseract_scene(
            driver=db_driver,
            scene_in=scene_metadata,
            scene_data_storage_uri=scene_data_storage_uri,
        )
        logger.info(f"Tesseract scene metadata created with ID: {created_scene.id}")
        return created_scene

    except Exception as e:
        logger.error(f"Failed to create Tesseract scene metadata: {e}", exc_info=True)
        # TODO: Add cleanup logic (delete scene file from storage if DB fails)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not create Tesseract scene metadata in database.",
        )


@router.get("/scenes/{scene_id}", response_model=schemas.TesseractScene)
async def get_scene_metadata(
    scene_id: uuid.UUID,
    db_driver: AsyncDriver = Depends(get_driver),
    current_user: User = Depends(
        get_current_active_user
    ),  # Optional: Check permissions
):
    """
    Retrieves metadata for a specific Tesseract scene, including its footprint
    and the location of its data file.
    """
    logger.info(f"Request received for Tesseract scene metadata: {scene_id}")
    try:
        scene = await crud.get_tesseract_scene(driver=db_driver, scene_id=scene_id)
        if not scene:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tesseract scene not found",
            )
        logger.debug(f"Retrieved metadata for scene {scene_id}")
        return scene
    except HTTPException as http_exc:
        # Re-raise HTTP exceptions directly
        raise http_exc
    except Exception as e:
        logger.error(
            f"Failed to retrieve Tesseract scene metadata for {scene_id}: {e}",
            exc_info=True,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve Tesseract scene metadata.",
        )


# TODO: Add endpoint to get list of scenes? (/scenes/) - Calls crud.get_all_tesseract_scenes
# TODO: Integrate Tesseract router into main.py
