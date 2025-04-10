import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

# --- Document Schemas ---


class DocumentBase(BaseModel):
    """Base schema for document metadata."""

    filename: str = Field(..., description="Original filename of the document")
    content_type: Optional[str] = Field(None, description="MIME type of the document")
    description: Optional[str] = Field(None, description="User-provided description")
    # Potential future fields: source, language, geospatial_info (e.g., GeoJSON Point)


class DocumentCreate(DocumentBase):
    """Schema used for creating a document entry.
    Often, filename and content_type might be derived from the UploadFile itself.
    Description is optional user input during upload.
    """

    pass  # Inherits fields from DocumentBase, specific creation logic handles file


class Document(DocumentBase):
    """Schema representing a document stored in the system, including generated fields."""

    id: uuid.UUID = Field(
        ..., description="Unique identifier for the document node in Neo4j"
    )
    storage_uri: str = Field(
        ...,
        description="URI or identifier for the document in Object Storage (e.g., MinIO path/key)",
    )
    created_at: datetime = Field(
        ..., description="Timestamp when the document was ingested"
    )
    updated_at: datetime = Field(
        ..., description="Timestamp when the document metadata was last updated"
    )
    # Optional: Add owner_id: Optional[uuid.UUID] if linking to users

    class Config:
        from_attributes = True  # Pydantic V2 setting for ORM mode


# --- Search Schemas ---


class SearchQuery(BaseModel):
    """Schema for submitting a search query."""

    query: str = Field(..., description="The keyword or phrase to search for")
    # Potential future fields: filters (date range, type), limit, offset


class DocumentSearchResult(BaseModel):
    """Schema for returning search results."""

    results: List[Document] = Field(
        ..., description="List of documents matching the search query"
    )
    total_count: int = Field(
        ..., description="Total number of matching documents found"
    )
