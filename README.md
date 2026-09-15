# AI-Powered Chatbot Assistant

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Uvicorn](https://img.shields.io/badge/Uvicorn-ASGI-499848.svg?style=flat-square)](https://www.uvicorn.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

An enterprise-ready, dual-runtime conversational AI application engineered with an asynchronous Python FastAPI backend, real-time Server-Sent Events (SSE) token streaming, client-side Web Speech recognition/synthesis, and document context ingestion (RAG-lite). The frontend provides a responsive, minimalist, three-panel workspace with light/dark theme toggle, built entirely with vanilla web technologies for zero compile-step deployment on both local servers and static hosts like GitHub Pages.

---

## Live Links and Deployments

- Live Client Interface: https://ayushsachan726.github.io/Al-Powered-Chatbot-Assistant/
- Source Code Repository: https://github.com/AyushSachan726/Al-Powered-Chatbot-Assistant

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [System Architecture](#system-architecture)
- [Workspace and UI Layout](#workspace-and-ui-layout)
- [Key Features](#key-features)
- [Deployment Modes](#deployment-modes)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [Installation and Setup](#installation-and-setup)
- [Configuration and Environment Variables](#configuration-and-environment-variables)
- [API Reference](#api-reference)
- [Operational Mechanisms](#operational-mechanisms)
- [Free Cloud Deployment Guide](#free-cloud-deployment-guide)
- [Portfolio and Viva Defense Guide](#portfolio-and-viva-defense-guide)
- [License](#license)

---

## Executive Summary

Standard chatbot projects often operate as simple synchronous wrappers around third-party APIs. When rate limits are reached or network interruptions occur, such architectures crash or become unresponsive.

The **AI-Powered Chatbot Assistant** implements an enterprise-grade dual-tier architecture:
1. **Cloud LLM Pipeline**: Integrates directly with Google Gemini 1.5 Flash via asynchronous REST streaming endpoints with automatic multi-model fallback.
2. **Contextual Fallback Engine**: A zero-dependency heuristic reasoning core that guarantees system continuity and high-quality structured outputs during offline evaluation, academic defense, and live demonstrations.
3. **Dual-Runtime Client**: Designed to run seamlessly either against the native FastAPI server or as a standalone client on static hosts (GitHub Pages) with direct client-side Gemini streaming.

The visual design language is inspired by modern productivity workspaces: clean visual hierarchy, Plus Jakarta Sans typography, segmented light/dark theme switches, dedicated history search rail, and integrated audio controls.

---

## System Architecture

```text
+---------------------------------------------------------------------------------+
|                          Client Tier (Browser Runtime)                          |
|                                                                                 |
|  +---------------------+     +--------------------------+     +---------------+  |
|  | Navigation Sidebar  |     |   Chat & Stream Canvas   |     | Projects Rail |  |
|  | - Personas Selector |     | - Starter Action Cards   |     | - Search Bar  |  |
|  | - Workspaces / Docs |     | - Input Dock & Attach    |     | - History List|  |
|  | - Theme Switcher    |     | - Voice STT / Read Aloud |     | - Export .md  |  |
|  +---------------------+     +--------------------------+     +---------------+  |
+----------------------------------------+----------------------------------------+
                                         |
                       Mode A: Static    |    Mode B: Full-Stack
                       (GitHub Pages)    |    (FastAPI / Uvicorn)
                                         |
                     +-------------------+-------------------+
                     |                                       |
                     v                                       v
    +---------------------------------+     +---------------------------------+
    |   Direct Client Inference       |     |  FastAPI Application Backend    |
    |  - Client Gemini SSE Stream     |     |  - Router & Static File Server  |
    |  - Local Heuristic Simulator    |     |  - PyPDF Document Ingestion     |
    |  - localStorage Persistence     |     |  - Multi-Model Fallback Engine  |
    +---------------------------------+     +---------------------------------+
                                                             |
                                                             v
                                            +---------------------------------+
                                            |         Inference Tier          |
                                            |  - Google Gemini 1.5 Flash API  |
                                            |  - Gemini 3.6 / Preview Models  |
                                            |  - Offline Contextual Engine    |
                                            +---------------------------------+
```

---

## Workspace and UI Layout

The frontend features a balanced three-panel layout designed for focus and productivity:

```text
+----------------+----------------------------------------+------------------+
|  ASSISTANT     |  AI Chat                      [Export] |  PROJECTS        |
|  [Search Ctrl+K]   |                                        |  [Search...]     |
|                |  Welcome to Assistant                  |                  |
|  PERSONAS      |  Get started by selecting a task:      |  TODAY           |
|  * General     |  +----------------+ +----------------+ |  * Algorithm Prep|
|  * Coder       |  | Code Architect | | Academic Tutor | |  * System Design |
|  * Tutor       |  +----------------+ +----------------+ |                  |
|  * Writer      |                                        |  YESTERDAY       |
|  * Career      |  User: Explain QuickSort in Python     |  * Essay Draft   |
|                |  Bot:  Here is an optimal solution...  |                  |
|  WORKSPACES    |                                        |  [Clear All]     |
|  * Documents   |  +-----------------------------------+ |                  |
|  * History     |  | Ask anything...        [Mic][Send]| |                  |
|  [Light|Dark]  |  +-----------------------------------+ |                  |
+----------------+----------------------------------------+------------------+
```

---

## Key Features

- **Real-Time Token Streaming**: Implements Server-Sent Events (`text/event-stream`) for incremental token delivery, minimizing perceived latency with animated typewriter feedback.
- **Five Specialized AI Personas**:
  - **General Assistant**: Balanced reasoning, general inquiry answering, and task organization.
  - **Senior Code Architect**: Generates clean, type-annotated code with time/space complexity analysis.
  - **Academic Tutor**: Breaks down complex subjects through structured analogies, step-by-step proofs, and practical examples.
  - **Creative & Content Writer**: Produces executive summaries, persuasive copy, and structured technical documentation.
  - **Career & Interview Coach**: Conducts mock interviews, reviews resumes, and formats behavioral answers via the STAR methodology.
- **Voice Recognition and Audio Synthesis**:
  - **Speech-to-Text (STT)**: Voice dictation powered by browser-native `SpeechRecognition` API.
  - **Text-to-Speech (TTS)**: Clean audio readout of responses with voice selector and playback toggle.
- **Document Context Ingestion (RAG-Lite)**: Supports `.pdf`, `.txt`, `.csv`, `.md`, and source files. The backend extracts text using `pypdf`, bounds context safely within 8,000 words, and injects it into the reasoning stream for targeted questions.
- **Session Management and Export**: Conversations persist in `localStorage` across page reloads. Includes live search across past chats and one-click Markdown (`.md`) export.
- **Clean Responsive Design System**: Vanilla CSS tokens, responsive flex and grid layouts, and zero third-party UI framework bloat.

---

## Deployment Modes

The repository supports two distinct operational modes:

### 1. Static Client Mode (GitHub Pages)
- Deployed at: https://ayushsachan726.github.io/Al-Powered-Chatbot-Assistant/
- Runs directly inside the browser using HTML5, CSS3, and modern JavaScript.
- Direct live Gemini streaming is enabled by entering your free Gemini API key in the Settings modal.
- Includes simulated offline intelligence when no API key is set.

### 2. Full-Stack Server Mode (Local / Render / VPS)
- Runs the complete Python FastAPI backend via `python main.py` or `run.bat`.
- Server handles API key storage, binary document parsing (`pypdf`), and automated multi-model cloud fallback.

---

## Technology Stack

| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Backend Language** | Python | 3.10+ | Core server runtime |
| **Server Framework** | FastAPI | 0.110+ | High-throughput async REST and SSE streaming |
| **ASGI Server** | Uvicorn | 0.28+ | Asynchronous server implementation |
| **HTTP Client** | HTTPX | 0.27+ | Async communication with Google Gemini API |
| **Document Parser** | PyPDF | 4.0+ | Binary PDF parsing and text normalization |
| **Data Validation** | Pydantic | 2.6+ | Request and response schema enforcement |
| **Frontend Structure** | Semantic HTML5 | Modern | Accessible application layout |
| **Frontend Styling** | Vanilla CSS3 | Modern | Custom CSS variables, dark/light themes |
| **Frontend Logic** | ES6+ JavaScript | Modern | Reactive state, SSE reader, DOM manipulation |
| **Audio Services** | Web Speech API | Native | Speech-to-text (STT) and Speech synthesis (TTS) |

---

## Directory Structure

```text
Al-Powered-Chatbot-Assistant/
|-- .env.example            # Environment variables configuration template
|-- .gitignore              # Git ignore rules for Python, cache, and secrets
|-- .nojekyll               # Bypasses Jekyll on GitHub Pages
|-- README.md               # Complete system documentation and guides
|-- ai_engine.py            # AI dispatch engine, streaming, and offline fallback
|-- index.html              # Root application entry point for static & cloud hosting
|-- main.py                 # FastAPI backend server and REST/SSE endpoints
|-- requirements.txt        # Production Python dependencies manifest
|-- run.bat                 # One-click Windows startup launcher script
`-- static/
    |-- app.js              # State manager, SSE consumer, STT/TTS controller
    |-- index.html          # Modular application template
    `-- style.css           # Design tokens, typography, dark/light mode styles
```

---

## Installation and Setup

### Prerequisites
- Python 3.10 or higher installed. Ensure Python is added to your system `PATH`.
- A modern web browser (Google Chrome, Microsoft Edge, Brave) for full Web Speech API compatibility.

### Step 1: Clone the Repository
```bash
git clone https://github.com/AyushSachan726/Al-Powered-Chatbot-Assistant.git
cd Al-Powered-Chatbot-Assistant
```

### Step 2: Create a Virtual Environment (Recommended)
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On Linux or macOS
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Required Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables
Copy the `.env.example` file to create your `.env` file:
```bash
# On Windows
copy .env.example .env

# On Linux or macOS
cp .env.example .env
```
Open `.env` and add your Google Gemini API key:
```env
PORT=8000
HOST=127.0.0.1
GEMINI_API_KEY=your_gemini_api_key_here
DEFAULT_AI_PROVIDER=gemini
```
*(Note: If you do not supply an API key, the built-in offline intelligence engine will still answer queries automatically).*

### Step 5: Launch the Application

#### Option A: Windows One-Click Launcher
Double-click `run.bat` in the root folder. The launcher verifies Python, starts the FastAPI server, and launches your browser at `http://localhost:8000`.

#### Option B: Terminal Command
```bash
python main.py
```
Open your browser and navigate to:
```text
http://localhost:8000
```

---

## API Reference

### 1. Health Status
- **Method**: `GET`
- **Path**: `/api/health`
- **Response**:
```json
{
  "status": "online",
  "service": "AI-Powered Chatbot Assistant",
  "personas_available": 5,
  "version": "1.0.0"
}
```

### 2. Available Personas
- **Method**: `GET`
- **Path**: `/api/personas`
- **Response**:
```json
[
  {
    "id": "coder",
    "name": "Senior Code Architect",
    "avatar": "DEV",
    "badge": "Python, JS, C++, Full-Stack",
    "system_prompt": "You are an expert Senior Software Engineer...",
    "welcome": "Ready to build. What software system are we programming today?"
  }
]
```

### 3. Server-Sent Events Streaming Chat
- **Method**: `POST`
- **Path**: `/api/chat/stream`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "messages": [
    { "role": "user", "content": "Explain the time complexity of QuickSort." }
  ],
  "persona": "coder",
  "doc_context": null,
  "api_key": null,
  "provider": "gemini"
}
```
- **Stream Output (`text/event-stream`)**:
```text
data: {"token": "QuickSort "}

data: {"token": "operates on "}

data: {"token": "an average time complexity of O(N log N)..."}

data: {"done": true}
```

### 4. Document Ingestion
- **Method**: `POST`
- **Path**: `/api/upload`
- **Headers**: `Content-Type: multipart/form-data`
- **Form Fields**: `file=@project_spec.pdf`
- **Response**:
```json
{
  "status": "success",
  "filename": "project_spec.pdf",
  "word_count": 2840,
  "text": "--- Page 1 ---\nProject Overview..."
}
```

---

## Operational Mechanisms

### Server-Sent Events (SSE) vs. WebSockets
The system selects Server-Sent Events over full-duplex WebSockets based on deliberate architectural considerations:
1. **Unidirectional Efficiency**: Chatbot token streaming flows exclusively from server to client. The client initiates the prompt via an HTTP POST request and consumes the incoming token stream. Maintaining bidirectional state via WebSockets introduces unnecessary socket complexity.
2. **HTTP/2 Infrastructure Compatibility**: SSE operates on standard HTTP protocols, eliminating firewall, reverse proxy, and API gateway issues that often disrupt WebSocket handshakes.
3. **Automatic Reconnection**: Modern browsers natively support reconnections and error handling for HTTP streaming interfaces.

### Multi-Model Cloud Fallback
When external cloud APIs experience transient rate limits or quota drops, `ai_engine.py` attempts streaming against prioritized fallback models:
```text
gemini-3.6-flash -> gemini-3-flash-preview -> gemini-flash-latest -> gemini-1.5-flash -> Offline Heuristic Core
```
If all external network connections fail, the application engages its offline synthesis engine to ensure zero downtime during critical demonstrations.

---

## Free Cloud Deployment Guide

To deploy the full-stack FastAPI application on the cloud for free:

### Deploying to Render (Free Web Service)
1. Fork or push this repository to your GitHub account.
2. Sign up or log in at https://render.com.
3. Click **New +** and select **Web Service**.
4. Connect your `Al-Powered-Chatbot-Assistant` repository.
5. Configure the deployment settings:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variables:
   - `GEMINI_API_KEY`: *(Your Google Gemini API Key)*
7. Click **Deploy Web Service**. Render provides a live HTTPS URL.

---

## Portfolio and Viva Defense Guide

### STAR Framework Interview Overview

- **Situation**: Most student and junior developer chatbots are rudimentary single-page scripts that break whenever external API quotas exhaust or network requests fail.
- **Task**: Design and implement a robust, production-grade conversational AI assistant featuring real-time token streaming, multi-persona reasoning, audio interaction, document ingestion, and 100% operational reliability.
- **Action**:
  - Architected an asynchronous **FastAPI** backend supporting Server-Sent Events (`/api/chat/stream`) and binary document parsing via **PyPDF**.
  - Built a zero-dependency frontend using **HTML5**, **Vanilla CSS3**, and **ES6 JavaScript**, avoiding heavy framework overhead while implementing responsive 3-panel workspace ergonomics.
  - Implemented browser-native voice transcription (STT) and speech synthesis (TTS) using the **Web Speech API**.
  - Engineered a resilient fallback strategy in `ai_engine.py` that switches from cloud LLM endpoints to a structured offline reasoning core upon connection drops.
- **Result**: Delivered a production-ready application capable of instant local execution via a single script (`run.bat`), static browser preview on GitHub Pages, and full-stack cloud hosting on Render.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
