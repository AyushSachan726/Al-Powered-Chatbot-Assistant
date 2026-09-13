# AI-Powered Chatbot Assistant

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Uvicorn](https://img.shields.io/badge/Uvicorn-ASGI-499848.svg?style=flat-square)](https://www.uvicorn.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

An enterprise-ready, full-stack conversational AI assistant engineered with an asynchronous Python FastAPI backend, real-time Server-Sent Events (SSE) token streaming, client-side Web Speech recognition/synthesis, and document context ingestion (RAG-lite). The frontend implements a responsive, minimal, three-panel workspace with light and dark theme switching, built with vanilla web technologies for zero compile-step deployment.

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [Installation and Setup](#installation-and-setup)
- [API Reference](#api-reference)
- [Operational Mechanisms](#operational-mechanisms)
- [Portfolio and Viva Defense Guide](#portfolio-and-viva-defense-guide)
- [License](#license)

---

## Executive Summary

The **AI-Powered Chatbot Assistant** addresses the operational need for a responsive, modular, and resilient conversational AI workspace. Unlike standard monolithic chat interfaces that fail when third-party API quotas deplete, this system employs a dual-inference strategy:

1. **Cloud LLM Pipeline**: Integrates directly with Google Gemini 1.5 Flash via official asynchronous REST streaming endpoints.
2. **Contextual Fallback Engine**: A zero-dependency heuristic reasoning core that guarantees system continuity and high-quality structured outputs during offline evaluation, academic defense, and live demonstrations.

The user interface adheres to contemporary software design principles: uncluttered visual hierarchy, Plus Jakarta Sans typography, segmented light/dark theme switches, dedicated history navigation, and integrated audio controls.

---

## System Architecture

```text
+-------------------------------------------------------------------------+
|                       Client Tier (Browser Runtime)                     |
|                                                                         |
|  +---------------------+   +---------------------+   +---------------+  |
|  | Navigation Sidebar  |   | Chat & Stream Canvas|   | Projects Rail |  |
|  | - Personas Selector |   | - Pastel Task Cards |   | - Search      |  |
|  | - Theme Switcher    |   | - Input Dock        |   | - Session List|  |
|  | - User Workspace    |   | - Voice STT / TTS   |   | - Export .md  |  |
|  +---------------------+   +---------------------+   +---------------+  |
+------------------------------------+------------------------------------+
                                     |
                                     | HTTP / SSE Stream (/api/chat/stream)
                                     v
+-------------------------------------------------------------------------+
|                    Application Tier (FastAPI / Uvicorn)                 |
|                                                                         |
|  +-------------------+  +---------------------+  +-------------------+  |
|  | Static File Server|  | Document Ingestion  |  | Chat Controller   |  |
|  | - HTML5 / CSS3 /JS|  | - PyPDF / Text Extr.|  | - SSE Generator   |  |
|  +-------------------+  +---------------------+  +-------------------+  |
+------------------------------------+------------------------------------+
                                     |
                                     | Dispatched via AIEngine
                                     v
+-------------------------------------------------------------------------+
|                            Inference Tier                               |
|                                                                         |
|          +----------------------------+  +----------------------------+ |
|          | Google Gemini API Provider |  | Offline Contextual Engine  | |
|          | - Live LLM Token Stream    |  | - Heuristic Synthesis Core | |
|          | - External API via httpx   |  | - Zero External Dependency | |
|          +----------------------------+  +----------------------------+ |
+-------------------------------------------------------------------------+
```

---

## Key Features

- **Real-Time Token Streaming**: Implements Server-Sent Events (`text/event-stream`) for incremental token delivery, minimizing perceived latency and providing a typewriter presentation.
- **Multi-Persona Profiles**:
  - `General Assistant`: Balanced reasoning, general Q&A, and task organization.
  - `Senior Code Architect`: Generates clean, type-annotated code with time/space complexity analysis.
  - `Academic Tutor`: Breaks down complex concepts through structured analogies and foundational proofs.
  - `Creative & Content Writer`: Produces executive summaries, persuasive marketing copy, and documentation.
  - `Career & Interview Coach`: Refines resumes and structures behavioral interview responses via the STAR framework.
- **Voice Capabilities**:
  - **Speech-to-Text (STT)**: Direct voice dictation using browser native `SpeechRecognition` API.
  - **Text-to-Speech (TTS)**: Clean audio synthesis using the `SpeechSynthesis` API with selectable browser voices.
- **Document Context Ingestion (RAG-Lite)**: Supports PDF, CSV, TXT, and source code file uploads. Text is parsed on the backend via `pypdf`, bound to the conversational context window, and queried with targeted prompts.
- **Session Management and Export**: Fully client-side persisted sessions in `localStorage`, real-time title search, and one-click Markdown (`.md`) export.
- **Design System**: Modular light and dark mode styling with custom CSS properties, Plus Jakarta Sans typography, and responsive three-panel workspace.

---

## Technology Stack

| Layer | Component | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Backend** | Python | 3.10+ | Core language runtime |
| **Backend Framework** | FastAPI | 0.110+ | Asynchronous ASGI REST & SSE endpoints |
| **ASGI Server** | Uvicorn | 0.28+ | High-throughput asynchronous server |
| **HTTP Client** | HTTPX | 0.27+ | Asynchronous communication with Gemini API |
| **Document Parsing** | PyPDF | 4.0+ | Binary PDF text extraction and indexing |
| **Validation** | Pydantic | 2.6+ | Request and response schema enforcement |
| **Frontend Runtime** | Vanilla ES6+ | Modern | Client-side controller and SSE consumer |
| **Styling** | Vanilla CSS3 | Modern | Custom design tokens, light/dark themes |
| **Audio Services** | Web Speech API | Native | Browser-level STT and TTS |

---

## Directory Structure

```text
Al-Powered Chatbot Assistant/
|-- .env.example            # Environment configuration template
|-- .gitignore              # Git ignore rules (Python cache, OS files)
|-- README.md               # System documentation and operational guide
|-- ai_engine.py            # AI dispatch engine (Cloud API & offline inference)
|-- main.py                 # FastAPI application server and endpoints
|-- requirements.txt        # Production dependency manifest
|-- run.bat                 # One-click Windows startup batch script
`-- static/
    |-- app.js              # Client state, streaming controller, STT/TTS
    |-- index.html          # Semantic HTML5 single-page application layout
    `-- style.css           # Design system tokens, light/dark themes, layout
```

---

## Installation and Setup

### Prerequisites
- Python 3.10 or higher installed. Ensure Python is added to the system `PATH`.
- Modern Chromium-based browser (Google Chrome, Microsoft Edge, Brave) for full Web Speech API compatibility.

### 1. Clone the Repository
```bash
git clone https://github.com/AyushSachan726/Al-Powered-Chatbot-Assistant.git
cd Al-Powered-Chatbot-Assistant
```

### 2. Set Up Virtual Environment (Recommended)
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment (Optional)
Create a `.env` file from the provided template:
```bash
copy .env.example .env
```
Add your Google Gemini API key if live cloud generation is desired:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8000
```

### 5. Launch the Application
#### Windows One-Click:
Double-click `run.bat` in the project root.

#### Command Line:
```bash
python main.py
```
Navigate to:
```text
http://localhost:8000
```

---

## API Reference

### 1. System Health
- **Endpoint**: `GET /api/health`
- **Response**:
```json
{
  "status": "online",
  "service": "AI-Powered Chatbot Assistant",
  "personas_available": 5,
  "version": "1.0.0"
}
```

### 2. List Personas
- **Endpoint**: `GET /api/personas`
- **Response**:
```json
[
  {
    "id": "general",
    "name": "General Assistant",
    "avatar": "AI",
    "badge": "Versatile & Smart",
    "system_prompt": "...",
    "welcome": "..."
  }
]
```

### 3. Streaming Chat (Server-Sent Events)
- **Endpoint**: `POST /api/chat/stream`
- **Content-Type**: `application/json`
- **Request Body**:
```json
{
  "messages": [
    { "role": "user", "content": "Explain binary search trees." }
  ],
  "persona": "coder",
  "doc_context": null,
  "api_key": null,
  "provider": "gemini"
}
```
- **Stream Output**:
```text
data: {"token": "Binary "}

data: {"token": "search "}

data: {"token": "trees..."}

data: {"done": true}
```

### 4. Document Ingestion
- **Endpoint**: `POST /api/upload`
- **Content-Type**: `multipart/form-data`
- **Form Data**: `file=@specification.pdf`
- **Response**:
```json
{
  "status": "success",
  "filename": "specification.pdf",
  "word_count": 1420,
  "text": "Extracted document text..."
}
```

---

## Operational Mechanisms

### Server-Sent Events (SSE) vs. WebSockets
The application adopts **Server-Sent Events (SSE)** over WebSockets for response streaming:
1. **Unidirectional Simplicity**: Chat interactions follow a request-response paradigm where the client issues a single payload and the server streams the generated tokens. Full-duplex communication (WebSockets) is unnecessary and introduces connection state overhead.
2. **HTTP/2 Transport Compatibility**: SSE runs over standard HTTP protocols, eliminating proxy, load-balancer, and firewall blocking issues common with custom WebSocket handshakes.
3. **Native Reconnection**: Browsers support standard event source recovery protocols inherently.

### Document Ingestion & RAG-Lite Pipeline
When a user uploads a file (`.pdf`, `.txt`, `.csv`, `.md`):
1. The backend inspects the MIME type and file header.
2. If binary PDF, `pypdf.PdfReader` iterates through pages, extracting raw text streams.
3. Text is normalized and bound to a safety limit (8,000 words) to prevent token window overflow.
4. The extracted document is injected into the model's system prompt context:
   ```text
   Context Document:
   ---
   [Extracted Text Content]
   ---
   Answer user queries utilizing the context above when relevant.
   ```

---

## Portfolio and Viva Defense Guide

### STAR Interview Defense Summary

- **Situation**: Most student or junior engineer chatbot projects consist of simple wrapper scripts around third-party APIs with no fallback mechanism, rudimentary styling, and vulnerability to network/quota failure during evaluations.
- **Task**: Architect and implement an enterprise-standard conversational AI application with streaming responses, multi-persona selection, document ingestion, and complete resilience against external API failures.
- **Action**:
  - Developed an asynchronous backend using **FastAPI** and **Uvicorn** to facilitate non-blocking Server-Sent Events.
  - Implemented client-side voice transcription and audio synthesis via the **Web Speech API**.
  - Designed a decoupled dual-inference pipeline in `ai_engine.py` providing instant cloud LLM capabilities alongside a deterministic offline synthesis engine.
  - Constructed a lightweight, zero-dependency frontend using **HTML5**, **Vanilla CSS3**, and **ES6 JavaScript**, adhering strictly to modern enterprise dashboard ergonomics.
- **Result**: Delivered a 100% reliable full-stack application capable of running locally with one click, supporting PDF question answering, voice conversations, and seamless light/dark theme switching.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
