# Selkie Project Architecture

## 1. Project Overview & Vision

### What is Selkie?

Selkie is envisioned as an advanced, integrated intelligence analysis suite. It's not a single application but an engine composed of distinct yet interconnected tools, designed to process, analyze, fuse, and visualize diverse data sources. The core philosophy is to leverage AI and sophisticated algorithms to augment human analysis, transforming raw data into actionable insights.

### What Does Selkie Do?

Selkie aims to provide a unified platform for:

*   **Natural Language Processing & Information Retrieval (Kappa)**: Understands user queries in natural language, searches vast datasets (documents, web, databases), generates summarized answers with sources, performs translation, and offers voice-to-text and voice identification capabilities. Includes both AI-driven and traditional algorithmic search methods.
*   **Aerial Imagery Analysis & Automatic Target Recognition (Djinn)**: Processes various imagery types (EO, SAR), automatically detects and identifies objects/entities using computer vision models trained on augmented datasets, and integrates findings with other tools.
*   **Electromagnetic Signal Processing (Ghost)**: Detects, records, analyzes, and potentially direction-finds RF signals using SDR hardware. Integrates with Kappa for transcription, translation, and identification.
*   **4D Spatio-Temporal Visualization (Tesseract)**: Reconstructs dynamic 3D scenes from fused data sources using Gaussian splatting, allowing users to visualize events unfolding over time in an interactive, immersive environment.

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
*   **Enhance Situational Awareness**: Achieve a clearer, more comprehensive understanding of events and environments, especially through advanced visualization like Tesseract.
*   **Make More Informed Decisions**: Base judgments on data that has been automatically processed, contextualized, and vetted (with user oversight).
*   **Leverage Cutting-Edge Technology**: Utilize advanced AI (LLMs, CV) and visualization techniques within a single, integrated platform.

## 2. Proposed Technology Stack

Based on project requirements and modern best practices:

*   **Backend Framework**: Python 3.13+ with **FastAPI** (Chosen for performance, async capabilities, automatic API docs, suitability for ML/data workloads).
*   **Frontend Framework**: **Next.js** (React-based, excellent for interactive UIs, SSR/SSG capabilities).
*   **Database**: **Neo4j** (Graph database for modeling relationships, metadata, identities) **+ Object Storage** (e.g., MinIO, S3 - for storing large binary files like images, audio, documents, Tesseract data).
*   **Containerization**: **Docker** & Docker Compose (For environment consistency, deployment, potential microservices).
*   **Dependency Management**: **Poetry** (For Python backend). Node.js/npm/yarn for Next.js frontend.
*   **Key Libraries (Examples)**:
    *   *Kappa*: LangChain/LlamaIndex, Transformers (Hugging Face), spaCy, SpeechRecognition libraries.
    *   *Djinn*: OpenCV, PyTorch/TensorFlow, Pillow.
    *   *Ghost*: PySDR, SciPy, NumPy (requires appropriate GNU Radio integration if using direct hardware).
    *   *Tesseract*: Libraries for Gaussian Splatting (e.g., potential Python bindings or custom implementation), 3D rendering libraries for frontend integration (e.g., Three.js).

## 3. High-Level Architecture

A modular, potentially microservices-based architecture is recommended, facilitated by Docker and FastAPI.

```mermaid
graph TD
    subgraph User Interface
        Frontend[Next.js Frontend]
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

    API_GW --> Auth_Service;
    API_GW --> Kappa_Service;
    API_GW --> Djinn_Service;
    API_GW --> Ghost_Service;
    API_GW --> Tesseract_Service;

    Kappa_Service --> GraphDB;
    Kappa_Service --> ObjectStore;
    Djinn_Service --> GraphDB;
    Djinn_Service --> ObjectStore;
    Ghost_Service --> GraphDB;
    Ghost_Service --> ObjectStore;
    Tesseract_Service --> GraphDB;
    Tesseract_Service --> ObjectStore;
    Auth_Service --> GraphDB;

    %% Potential Inter-service Communication can be added later
    %% Example: Kappa_Service <--> Djinn_Service;

```

**Component Responsibilities:**

*   **Frontend (Next.js)**: Provides the user interface, interacts with the API Gateway.
*   **API Gateway (FastAPI)**: Central entry point for the frontend, routes requests to appropriate backend services, handles initial authentication/authorization.
*   **Backend Services (FastAPI)**: Encapsulate the core logic for each tool (Kappa, Djinn, Ghost, Tesseract) and cross-cutting concerns (Auth). Each service interacts with the data stores as needed.
*   **Graph Database (Neo4j)**: Stores structured metadata, relationships between entities, user information, identity links, analysis states.
*   **Object Storage (MinIO/S3)**: Stores large binary files (documents, images, audio recordings, Tesseract scene files) referenced by the Graph DB.

## 4. Data Management Strategy

A hybrid approach is crucial:

*   **Neo4j**: Model entities (documents, images, signals, people, places, objects, concepts, users, identities) as nodes. Model connections (mentions, contains, detected_in, associated_with, created_by) as relationships. Store metadata (timestamps, filenames, confidence scores, processing status) as properties on nodes/relationships. Store pointers (URIs/IDs) to files in Object Storage.
*   **Object Storage**: Store the raw binary data. Use a consistent naming convention or UUIDs for file identification, linked from Neo4j.

## 5. Phased Development Plan Outline

A suggested iterative approach to build complexity gradually:

1.  **Phase 1: Foundation & Setup**: Project structure (Poetry, Git), Docker Compose (FastAPI, Next.js, Neo4j, MinIO), basic API connection, User Auth service.
2.  **Phase 2: Kappa MVP**: Text document ingestion (Object Store + Neo4j metadata), basic keyword search (Neo4j), frontend display, basic identity management.
3.  **Phase 3: Djinn MVP**: Image ingestion (Object Store + Neo4j), integrate pre-trained object detection, store results in Neo4j, basic frontend display.
4.  **Phase 4: Ghost MVP**: Ingest signal *metadata* (timestamps, source info) into Neo4j, link to potential recordings in Object Store.
5.  **Phase 5: Tesseract MVP**: Ingest pre-processed Gaussian splat data (Object Store + Neo4j), integrate basic static 3D viewer in frontend.
6.  **Subsequent Phases**: Enhance each module (AI integration, training, real-time processing), implement inter-service communication for data fusion, build collaboration features, refine UI/UX.

## 6. Key Considerations & Risks

*   **Scalability**: Design services and data models with potential future scaling in mind (especially for Djinn processing and Tesseract rendering).
*   **Performance**: Real-time aspects (Tesseract, potentially Ghost) will require careful optimization and likely GPU acceleration. Neo4j query optimization will be important.
*   **Complexity**: Integrating multiple advanced technologies (AI, CV, SDR, 3D Graphics) is inherently complex. Phased development helps manage this.
*   **Data Security & Privacy**: Implement robust authentication, authorization, and potentially data encryption, especially if handling sensitive information.
*   **Hardware Requirements**: Djinn, Ghost (with SDR), and Tesseract may have significant hardware dependencies (GPUs, SDR devices).
*   **Model Training & Management**: Djinn and potentially Kappa will require robust pipelines for training, evaluating, and deploying ML/AI models.