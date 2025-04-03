import React from 'react';
import Layout from '../components/layout/Layout'; // Assuming a Layout component exists
import DocumentUploadForm from '../components/kappa/DocumentUploadForm';
import DocumentSearch from '../components/kappa/DocumentSearch';
// Import styles if needed, e.g., import styles from '../styles/Kappa.module.css';

const KappaPage: React.FC = () => {
    return (
        <Layout>
            <h1>Kappa Service Interface</h1>
            <p>Interact with the Natural Language Processing & Information Retrieval service.</p>

            <hr style={{ margin: '20px 0' }} />

            <DocumentUploadForm />

            <hr style={{ margin: '20px 0' }} />

            <DocumentSearch />

            {/* Add more Kappa-related components or information here later */}
        </Layout>
    );
};

export default KappaPage;