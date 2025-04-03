# Selkie Project Architecture

## 1. Project Overview & Vision

### What is Selkie?

Selkie is envisioned as an advanced, integrated intelligence analysis suite. It's not a single application but an engine composed of distinct yet interconnected tools, designed to process, analyze, fuse, and visualize diverse data sources. The core philosophy is to leverage AI and sophisticated algorithms to augment human analysis, transforming raw data into actionable insights.

### What Does Selkie Do?

Selkie aims to provide a unified platform for:

*   **Natural Language Processing & Information Retrieval (Kappa)**: The NLP engine. Understands user queries, searches diverse datasets, generates summarized answers, performs translation, and handles voice interactions. Includes AI-driven (planned: Google Gemini) and traditional search methods. Provides geospatial context for map display where applicable (e.g., document locations).
*   **Aerial Imagery Analysis & Automatic Target Recognition (Djinn)**: The Computer Vision engine. Processes imagery (EO, SAR) to automatically detect and identify objects/entities. Relies heavily on the `Shared Map Component` for visualizing results (e.g., detected object locations).
*   **Electromagnetic Signal Processing (Ghost)**: The Signal Processing engine. Detects, analyzes, and potentially direction-finds RF signals using SDR hardware. Relies heavily on the `Shared Map Component` for visualizing results (e.g., signal source estimates). Integrates with Kappa for transcription/translation.
*   **4D Spatio-Temporal Visualization (Tesseract)**: The 3D Visualization engine. Reconstructs dynamic 3D scenes from fused data sources using techniques like Gaussian Splatting (representing scenes as collections of 3D Gaussians). Provides immersive visualization in a dedicated viewer and supplies a 2D `Tesseract Footprint` to the `Shared Map Component`.
*   **Geospatial Visualization (Shared Map Component)**: Provides a central, interactive 2D map interface (using Leaflet/React-Leaflet) for visualizing geospatial metadata and analysis results derived from `Kappa`, `Djinn`, and `Ghost`. Also displays the geographic `Tesseract Footprint` (the 2D area covered by a `Tesseract` 3D scene).

### What Problems Does Selkie Solve?

Selkie addresses several challenges faced in intelligence analysis and complex data interpretation:

*   **Information Overload**: Automates the sifting and processing of large volumes of disparate data (text, images, signals).
*   **Data Silos**: Fuses information from different domains (language, vision, signals) to create a more holistic understanding than analyzing each source in isolation.
*   **Time-Consuming Analysis**: Accelerates tasks like document review, image screening, signal deciphering, and scene reconstruction through AI and automation.
*   **Contextual Understanding**: Goes beyond simple data retrieval to infer relationships, context, and potential significance, aided by graph-based data modeling.
*   **Visualization Complexity**: Provides intuitive ways (including novel 4D visualization) to understand complex, dynamic events and spatial relationships.
*   **Collaboration Barriers**: Facilitates sharing of analytical products and states among users.

### Why Use Selkie?

Analysts, researchers, decision-makers, or anyone dealing with multi-source, complex data would use Selkie to:

*   **Gain Deeper Insights**: Uncover hidden connections and patterns by fusing diverse data types.
*   **Improve Efficiency**: Significantly reduce the time and effort required for data processing and analysis.
*   **Enhance Situational Awareness**: Achieve a clearer, more comprehensive understanding of events and environments through the integrated `Shared Map Component` for 2D spatial context and `Tesseract`'s immersive 3D views.
*   **Make More Informed Decisions**: Base judgments on data that has been automatically processed, contextualized, and vetted (with user oversight).
*   **Leverage Cutting-Edge Technology**: Utilize advanced AI (LLMs, CV) and visualization techniques within a single, integrated platform.

## 2. Proposed Technology Stack

Based on project requirements and modern best practices:

*   **Backend Framework**: Python 3.13+ with **FastAPI** (Chosen for performance, async capabilities, automatic API docs, suitability for ML/data workloads).
*   **Frontend Framework**: **Next.js** (React-based, excellent for interactive UIs, SSR/SSG capabilities), utilizing **React-Leaflet** and **Leaflet** for the core 2D mapping component.
*   **Database**: **Neo4j** (Graph database for modeling relationships, metadata, identities) **+ Object Storage** (e.g., MinIO, S3 - for storing large binary files like images, audio, documents, Tesseract data).
*   **Containerization**: **Docker** & Docker Compose (For environment consistency, deployment, potential microservices).
*   **Dependency Management**: **Poetry** (For Python backend). Node.js/npm/yarn for Next.js frontend.
*   **Key Libraries (Examples)**:
    *   *Kappa*: LangChain/LlamaIndex, Transformers (Hugging Face), spaCy, SpeechRecognition libraries.
 (Future integration planned with Google Gemini LLM).
    *   *Djinn*: OpenCV, PyTorch/TensorFlow, Pillow.
    *   *Ghost*: PySDR, SciPy, NumPy (requires appropriate GNU Radio integration if using direct hardware).
    *   *Tesseract*: Libraries for Gaussian Splatting (representing scenes as 3D Gaussians, e.g., potential Python bindings or custom implementation), 3D rendering libraries for frontend integration (e.g., Three.js).
*     *   *Mapping*: Leaflet (core JS mapping library), React-Leaflet (React integration components).

## 3. High-Level Architecture

A modular, potentially microservices-based architecture is recommended, facilitated by Docker and FastAPI.

```mermaid
graph TD
    subgraph User Interface
        Frontend[Next.js Frontend]
        MapComponent[Shared Map Component (React-Leaflet)]
        TesseractViewer[(Tesseract 3D Viewer - Implicit)]
        Frontend -- Contains/Uses --> MapComponent;
        Frontend -- Contains/Uses --> TesseractViewer;
    end

    subgraph Backend Services (Dockerized)
        API_GW[API Gateway (FastAPI)]
        Kappa_Service[Kappa Service (FastAPI + LLM/NLP Libs)]
        Djinn_Service[Djinn Service (FastAPI + CV Libs)]
        Ghost_Service[Ghost Service (FastAPI + SDR/DSP Libs)]
        Tesseract_Service[Tesseract Service (FastAPI + Splatting Libs)]
        Auth_Service[Auth Service (FastAPI)]
    end

    subgraph Data Stores (Dockerized/External)
        GraphDB[(Neo4j Graph DB)]
        ObjectStore[(Object Storage MinIO/S3)]
    end

    Frontend --> API_GW;

    %% Data flow FROM API GW TO Backend Services
    API_GW --> Auth_Service;
    API_GW -- Request Kappa Data --> Kappa_Service;
    API_GW -- Request Djinn Data --> Djinn_Service;
    API_GW -- Request Ghost Data --> Ghost_Service;
    API_GW -- Request Tesseract Data --> Tesseract_Service;

    %% Data flow FROM Backend Services TO API GW (for UI display)
    Kappa_Service -- GeoData/Results --> API_GW;
    Djinn_Service -- GeoData/Results --> API_GW;
    Ghost_Service -- GeoData/Results --> API_GW;
    Tesseract_Service -- FootprintData --> API_GW;
    Tesseract_Service -- 3D Scene Data --> API_GW;

    %% Backend Service to Data Store Interactions
    Kappa_Service --> GraphDB;
    Kappa_Service --> ObjectStore;
    Djinn_Service --> GraphDB;
    Djinn_Service --> ObjectStore;
    Ghost_Service --> GraphDB;
    Ghost_Service --> ObjectStore;
    Tesseract_Service --> GraphDB;
    Tesseract_Service --> ObjectStore;
    Auth_Service --> GraphDB;
```

**Component Responsibilities:**

*   **Frontend (Next.js)**: Provides the user interface, integrating data display on the `Shared Map Component` (using Leaflet/React-Leaflet) and hosting the separate `Tesseract 3D Viewer`. Interacts with the API Gateway.
*   **Shared Map Component (Conceptual)**: Provides interactive 2D map visualization using Leaflet, displaying geospatial data layers and results from `Kappa`, `Djinn`, and `Ghost`, as well as `Tesseract Footprints`.
*   **API Gateway (FastAPI)**: Central entry point for the frontend; routes requests to appropriate backend services, handles initial authentication/authorization, and potentially aggregates/formats geospatial data from backend services (`Kappa`, `Djinn`, `Ghost`, `Tesseract`) specifically for map display (`Shared Map Component` and `Tesseract Footprint`).
*   **Backend Services (FastAPI)**: Encapsulate the core logic for each tool (`Kappa`, `Djinn`, `Ghost`, `Tesseract`) and cross-cutting concerns (`Auth`). Each service interacts with the data stores as needed and provides relevant data (including geospatial) to the API Gateway.
*   **Tesseract Service**: Manages 3D scene reconstruction (using techniques like `Gaussian Splatting`) and provides both 3D scene data (for the dedicated viewer) and 2D `Tesseract Footprint` data (for the `Shared Map Component`).
*   **Graph Database (Neo4j)**: Stores structured metadata, relationships between entities, user information, identity links, analysis states.
*   **Object Storage (MinIO/S3)**: Stores large binary files (documents, images, audio recordings, Tesseract scene files) referenced by the Graph DB.

## 4. Data Management Strategy

A hybrid approach is crucial:

*   **Neo4j**: Model entities (documents, images, signals, people, places, objects, concepts, users, identities) as nodes. Model connections (mentions, contains, detected_in, associated_with, created_by) as relationships. Store metadata (timestamps, filenames, confidence scores, processing status) as properties on nodes/relationships. Store pointers (URIs/IDs) to files in Object Storage.
*   **Object Storage**: Store the raw binary data. Use a consistent naming convention or UUIDs for file identification, linked from Neo4j.

## 5. Phased Development Plan Outline

A suggested iterative approach to build complexity gradually:

1.  **Phase 1: Foundation & Setup (Largely Complete)**: Project structure (Poetry, Git), Docker Compose (FastAPI, Next.js, Neo4j, MinIO), basic API connection, User Auth service implemented. *Note: Full integration of service routers in backend `main.py` is pending.*
2.  **Phase 2: Kappa MVP**: Text document ingestion (Object Store + Neo4j metadata), basic keyword search (Neo4j), frontend display, basic identity management.
 Integrate Kappa router into backend `main.py`.
3.  **Phase 2.5: Shared Map Component MVP**: Implement basic Leaflet map display in the frontend (`Shared Map Component`), connected via the API GW. Initially display simple markers (e.g., from `Kappa` document metadata or test data), preparing for `Djinn`/`Ghost` integration.
4.  **Phase 3: Djinn MVP**: Image ingestion (Object Store + Neo4j), integrate pre-trained object detection, store results in Neo4j. **Integrate visualization of detected object locations onto the `Shared Map Component`.** Integrate Djinn router into backend `main.py`.
5.  **Phase 4: Ghost MVP**: Ingest signal *metadata* (timestamps, source info) into Neo4j, link to potential recordings in Object Store.
 **Integrate visualization of signal data (e.g., source estimates) onto the `Shared Map Component`.** Integrate Ghost router into backend `main.py`.
6.  **Phase 5: Tesseract MVP**: Ingest pre-processed Gaussian splat data (Object Store + Neo4j), integrate basic static 3D viewer in frontend. **Display the `Tesseract Footprint` on the `Shared Map Component`, linking to the 3D viewer.** Integrate Tesseract router into backend `main.py`.
7.  **Subsequent Phases**: Enhance each module (AI integration like Gemini for Kappa, training, real-time processing), implement inter-service communication for data fusion, build collaboration features, refine UI/UX, improve map interactions and data layering.

## 6. Key Considerations & Risks

*   **Scalability**: Design services and data models with potential future scaling in mind (especially for Djinn processing and Tesseract rendering).
*   **Performance**: Real-time aspects (Tesseract, potentially Ghost) will require careful optimization and likely GPU acceleration. Neo4j query optimization will be important.
*   **Complexity**: Integrating multiple advanced technologies (AI, CV, SDR, 3D Graphics) is inherently complex. Phased development helps manage this.
*   **Data Security & Privacy**: Implement robust authentication, authorization, and potentially data encryption, especially if handling sensitive information.
*   **Hardware Requirements**: Djinn, Ghost (with SDR), and Tesseract may have significant hardware dependencies (GPUs, SDR devices).
*   **Model Training & Management**: Djinn and potentially Kappa will require robust pipelines for training, evaluating, and deploying ML/AI models.
*   **Map Component Complexity**: Managing shared state, filtering logic, data layering, and performance for the central `Shared Map Component` (receiving data from `Kappa`, `Djinn`, `Ghost`, `Tesseract`) requires careful frontend architecture.
*   **Geospatial Data Handling**: Efficient storage, indexing (in Neo4j), and querying of potentially large/complex geospatial data (points, polygons like `Tesseract Footprints`) is critical for map performance.