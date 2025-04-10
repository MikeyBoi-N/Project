import uuid
from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, Field

# --- Signal Event Schemas ---


class SignalEventBase(BaseModel):
    """Base schema for signal event metadata."""

    timestamp: datetime = Field(
        ..., description="Timestamp when the signal event occurred or was logged"
    )
    description: Optional[str] = Field(
        None, description="User-provided description or context for the signal event"
    )
    source_info: Optional[str] = Field(
        None,
        description="Information about the source (e.g., device ID, location description)",
    )

    # Key signal parameters (examples, adjust based on actual needs)
    frequency_hz: Optional[float] = Field(None, description="Center frequency in Hertz")
    bandwidth_hz: Optional[float] = Field(None, description="Bandwidth in Hertz")
    modulation_type: Optional[str] = Field(
        None, description="Detected or assumed modulation type"
    )
    signal_strength_db: Optional[float] = Field(
        None, description="Measured signal strength (e.g., dBm)"
    )

    # CRUCIAL for map display: Estimated location
    latitude: Optional[float] = Field(
        None, description="Estimated latitude of the signal source"
    )
    longitude: Optional[float] = Field(
        None, description="Estimated longitude of the signal source"
    )
    location_accuracy_m: Optional[float] = Field(
        None, description="Estimated accuracy of the location in meters"
    )

    # Optional link to raw recording file
    recording_filename: Optional[str] = Field(
        None,
        description="Filename of the associated recording in object storage (if any)",
    )

    # Allow flexible metadata storage
    additional_metadata: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        description="Flexible key-value store for other signal parameters",
    )


class SignalEventCreate(SignalEventBase):
    """Schema used for creating a signal event entry."""

    # If recording is uploaded simultaneously, handle file separately
    pass  # Inherits fields from SignalEventBase


class SignalEvent(SignalEventBase):
    """Schema representing a signal event stored in the system."""

    id: uuid.UUID = Field(
        ..., description="Unique identifier for the signal event node in Neo4j"
    )
    created_at: datetime = Field(
        ..., description="Timestamp when the event was logged into the system"
    )
    # Optional link to recording file URI in object storage
    recording_storage_uri: Optional[str] = Field(
        None, description="URI/identifier for the recording in Object Storage"
    )

    class Config:
        from_attributes = True  # Pydantic V2 setting
