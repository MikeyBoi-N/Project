import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout'; // Assuming Layout component exists
import TesseractViewer from '../components/tesseract/TesseractViewer';
// Import styles if needed

const TesseractPage: React.FC = () => {
    const router = useRouter();
    // Example: Get scene ID from query parameter, e.g., /tesseract?sceneId=xyz
    const { sceneId } = router.query;

    // TODO: Fetch scene metadata (including sceneDataUri) based on sceneId
    // For now, passing sceneId directly to the viewer for display purposes.
    // const sceneDataUri = fetchedMetadata?.scene_data_storage_uri;

    return (
        <Layout title={`Tesseract Scene ${sceneId ? `- ${sceneId}` : ''}`}>
            <h1>Tesseract 4D Viewer</h1>
            {sceneId ? (
                <p>Displaying scene: {sceneId}</p>
            ) : (
                <p>No specific scene ID provided. Displaying placeholder.</p>
            )}

            <TesseractViewer
                sceneId={typeof sceneId === 'string' ? sceneId : undefined}
                // sceneDataUri={sceneDataUri} // Pass this when available
            />

            {/* Add controls or metadata display related to the scene later */}
        </Layout>
    );
};

export default TesseractPage;