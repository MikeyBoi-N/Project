import React, { useState, useCallback } from 'react';
import axios from 'axios'; // Assuming axios is installed

// Define expected structure for metadata input (matches TesseractSceneCreate)
interface SceneMetadataInput {
    name?: string;
    description?: string;
    timestamp: string; // Expect ISO string from input
    footprint_geojson: string; // Expect GeoJSON as a string from textarea
    source_data_description?: string;
    // reconstruction_parameters: Record<string, any>; // Maybe handle later
}

const TesseractSceneUploadForm: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState<Partial<SceneMetadataInput>>({
        timestamp: new Date().toISOString(), // Default to now
        footprint_geojson: `{
    "type": "Polygon",
    "coordinates": [
        [
            [-0.15, 51.52],
            [-0.10, 51.52],
            [-0.10, 51.50],
            [-0.15, 51.50],
            [-0.15, 51.52]
        ]
    ]
}` // Default example
    });
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            setUploadStatus('');
            setError(null);
        }
    };

    const handleMetadataChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setMetadata(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedFile) {
            setError('Please select a scene data file (.splat, etc.).');
            return;
        }
        if (!metadata.timestamp || !metadata.footprint_geojson) {
             setError('Timestamp and Footprint GeoJSON are required.');
            return;
        }

        let parsedFootprint;
        try {
            parsedFootprint = JSON.parse(metadata.footprint_geojson);
            // Basic validation (could be more thorough)
            if (parsedFootprint?.type !== 'Polygon' && parsedFootprint?.type !== 'MultiPolygon') {
                throw new Error('GeoJSON must be a Polygon or MultiPolygon.');
            }
        } catch (e) {
            setError('Invalid Footprint GeoJSON format. Please provide valid JSON.');
            return;
        }

        setIsLoading(true);
        setUploadStatus('Uploading...');
        setError(null);

        const formData = new FormData();
        formData.append('scene_file', selectedFile);

        // Prepare metadata payload according to backend expectations
        const metadataPayload = {
            name: metadata.name,
            description: metadata.description,
            timestamp: metadata.timestamp, // Assuming backend handles ISO string
            footprint_geojson: parsedFootprint, // Send parsed JSON
            source_data_description: metadata.source_data_description,
            // reconstruction_parameters: {} // Add if needed
        };

        // Append metadata as a JSON string blob - common pattern for multipart forms
        // The backend needs to parse this field. Adjust if backend expects fields directly.
        formData.append('scene_metadata', new Blob([JSON.stringify(metadataPayload)], { type: 'application/json' }));


        try {
            // TODO: Get API endpoint URL from config/env
            // TODO: Add authentication token
            const response = await axios.post('/api/tesseract/scenes/upload', formData, {
                headers: {
                    // Content-Type is set automatically by browser for FormData
                    // 'Authorization': `Bearer ${authToken}`
                },
            });

            if (response.status === 201) {
                setUploadStatus(`Successfully uploaded scene: ${response.data.id}`);
                setSelectedFile(null);
                // Reset metadata fields if desired
            } else {
                throw new Error(`Upload failed with status: ${response.status}`);
            }
        } catch (err: any) {
            logger.error('Scene upload failed:', err);
            setError(err.response?.data?.detail || err.message || 'An unknown error occurred during upload.');
            setUploadStatus('');
        } finally {
            setIsLoading(false);
        }
    }, [selectedFile, metadata]);

    return (
        <div>
            <h2>Upload Tesseract Scene</h2>
            <form onSubmit={handleSubmit}>
                {/* Metadata Fields */}
                <div>
                    <label htmlFor="sceneName">Scene Name (Optional):</label>
                    <input id="sceneName" name="name" type="text" value={metadata.name || ''} onChange={handleMetadataChange} disabled={isLoading} />
                </div>
                <div>
                    <label htmlFor="sceneDesc">Description (Optional):</label>
                    <textarea id="sceneDesc" name="description" value={metadata.description || ''} onChange={handleMetadataChange} disabled={isLoading} rows={3}></textarea>
                </div>
                 <div>
                    <label htmlFor="sceneTimestamp">Timestamp:</label>
                    <input id="sceneTimestamp" name="timestamp" type="datetime-local" value={metadata.timestamp ? metadata.timestamp.substring(0, 16) : ''} onChange={handleMetadataChange} required disabled={isLoading} />
                </div>
                 <div>
                    <label htmlFor="sceneFootprint">Footprint (GeoJSON Polygon/MultiPolygon):</label>
                    <textarea id="sceneFootprint" name="footprint_geojson" value={metadata.footprint_geojson || ''} onChange={handleMetadataChange} required disabled={isLoading} rows={10} style={{ fontFamily: 'monospace', width: '90%' }}></textarea>
                </div>
                 <div>
                    <label htmlFor="sceneSourceDesc">Source Data Description (Optional):</label>
                    <input id="sceneSourceDesc" name="source_data_description" type="text" value={metadata.source_data_description || ''} onChange={handleMetadataChange} disabled={isLoading} />
                </div>

                {/* File Input */}
                 <div style={{ marginTop: '15px' }}>
                    <label htmlFor="sceneFileInput">Select Scene File (.splat, etc.):</label>
                    <input
                        id="sceneFileInput"
                        type="file"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        required
                        // accept=".splat" // Example accept attribute
                    />
                </div>

                <button type="submit" disabled={!selectedFile || isLoading} style={{ marginTop: '15px' }}>
                    {isLoading ? 'Uploading...' : 'Upload Scene'}
                </button>
            </form>
            {uploadStatus && <p style={{ color: 'green' }}>{uploadStatus}</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </div>
    );
};

// Add logger instance if needed
const logger = {
    error: (...args: any[]) => console.error(...args),
    debug: (...args: any[]) => console.log(...args),
    warn: (...args: any[]) => console.warn(...args),
};

export default TesseractSceneUploadForm;