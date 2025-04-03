import React, { useState, useCallback } from 'react';
import axios from 'axios'; // Axios should now be available

// Assuming the Document schema from backend/app/kappa/schemas.py is mirrored here
// Create a types file (e.g., frontend/types/kappa.ts) for shared types later
interface KappaDocument {
    id: string; // UUID represented as string
    filename: string;
    content_type?: string | null;
    description?: string | null;
    storage_uri: string;
    created_at: string; // ISO datetime string
    updated_at: string; // ISO datetime string
}

interface DocumentSearchResult {
    results: KappaDocument[];
    total_count: number;
}

const DocumentSearch: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<KappaDocument[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const handleSearch = useCallback(async () => {
        if (!query.trim()) {
            setError('Please enter a search query.');
            setResults([]);
            setTotalCount(0);
            return;
        }

        setIsLoading(true);
        setError(null);
        setResults([]); // Clear previous results
        setTotalCount(0);

        try {
            // TODO: Get API endpoint URL from config/env
            // TODO: Add authentication token
            const response = await axios.post<DocumentSearchResult>('/api/kappa/documents/search', {
                query: query,
            }
            // , { headers: { 'Authorization': `Bearer ${authToken}` } } // Add auth token here
            );

            if (response.data) {
                setResults(response.data.results);
                setTotalCount(response.data.total_count);
                logger.debug(`Search successful for query "${query}", found ${response.data.total_count} results.`);
            } else {
                throw new Error('Search response did not contain data.');
            }
        } catch (err: any) {
            logger.error(`Search failed for query "${query}":`, err);
            setError(err.response?.data?.detail || err.message || 'An unknown error occurred during search.');
            setResults([]);
            setTotalCount(0);
        } finally {
            setIsLoading(false);
        }
    }, [query]); // Dependency on query

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleSearch();
    };


    return (
        <div>
            <h2>Search Documents (Kappa)</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={query}
                    onChange={handleQueryChange}
                    placeholder="Enter search keywords..."
                    disabled={isLoading}
                    style={{ marginRight: '10px' }}
                />
                <button type="submit" disabled={isLoading || !query.trim()}>
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {isLoading && <p>Loading results...</p>}

            {!isLoading && results.length > 0 && (
                <div>
                    <h3>Search Results ({totalCount} found)</h3>
                    <ul>
                        {results.map((doc) => (
                            <li key={doc.id}>
                                <strong>{doc.filename}</strong>
                                {doc.description && ` - ${doc.description}`}
                                <br />
                                <small>ID: {doc.id} | Created: {new Date(doc.created_at).toLocaleString()}</small>
                                {/* TODO: Add link to view/download document */}
                            </li>
                        ))}
                    </ul>
                    {/* TODO: Add pagination if totalCount > results.length */}
                </div>
            )}

            {!isLoading && !error && results.length === 0 && query && (
                 <p>No documents found matching your query.</p>
            )}
        </div>
    );
};

// Add logger instance if needed
const logger = {
    error: (...args: any[]) => console.error(...args),
    debug: (...args: any[]) => console.log(...args), // Use console.log for debug on frontend
};

export default DocumentSearch;