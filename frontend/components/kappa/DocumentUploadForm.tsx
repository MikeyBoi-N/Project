import React, { useState, useCallback } from 'react';
import axios from 'axios'; // Or use fetch API

const DocumentUploadForm: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [description, setDescription] = useState<string>('');
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

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };

    const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedFile) {
            setError('Please select a file to upload.');
            return;
        }

        setIsLoading(true);
        setUploadStatus('Uploading...');
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedFile);
        if (description) {
            formData.append('description', description);
        }

        try {
            // TODO: Get API endpoint URL from config/env
            // TODO: Add authentication token (e.g., from context/state management)
            const response = await axios.post('/api/kappa/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // 'Authorization': `Bearer ${authToken}` // Add auth token here
                },
            });

            if (response.status === 201) {
                setUploadStatus(`Successfully uploaded: ${response.data.filename}`);
                setSelectedFile(null); // Clear file input after successful upload
                setDescription('');
                // Optionally: trigger a refresh of a document list elsewhere
            } else {
                throw new Error(`Upload failed with status: ${response.status}`);
            }
        } catch (err: any) {
            logger.error('Upload failed:', err);
            setError(err.response?.data?.detail || err.message || 'An unknown error occurred during upload.');
            setUploadStatus('');
        } finally {
            setIsLoading(false);
        }
    }, [selectedFile, description]); // Add dependencies

    return (
        <div>
            <h2>Upload Document (Kappa)</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="fileInput">Select File:</label>
                    <input
                        id="fileInput"
                        type="file"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        // Consider adding accept attribute for specific file types
                        // accept=".txt,.pdf,.docx"
                    />
                </div>
                <div>
                    <label htmlFor="descriptionInput">Description (Optional):</label>
                    <input
                        id="descriptionInput"
                        type="text"
                        value={description}
                        onChange={handleDescriptionChange}
                        disabled={isLoading}
                        maxLength={200} // Example limit
                    />
                </div>
                <button type="submit" disabled={!selectedFile || isLoading}>
                    {isLoading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
            {uploadStatus && <p style={{ color: 'green' }}>{uploadStatus}</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </div>
    );
};

// Add logger instance if needed, e.g., using a simple console logger for frontend
const logger = {
    error: (...args: any[]) => console.error(...args),
    // Add other levels if needed
};


export default DocumentUploadForm;