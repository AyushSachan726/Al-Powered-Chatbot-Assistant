# 🤖 AI-Powered Chatbot Assistant (Nexus AI)

An enterprise-grade, full-stack conversational AI assistant application featuring a modern glassmorphic ChatGPT/Gemini-style interface, multi-persona reasoning, real-time Server-Sent Events (SSE) streaming, voice input/output (STT & TTS), and document intelligence (RAG-lite).

![AI-Powered Chatbot Assistant](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Features

1. **Modern Glassmorphic Dark UI**:
   - Designed with curated HSL color palettes, violet/indigo glowing accents, and smooth micro-animations.
   - Built with Vanilla HTML5, CSS3, and modern ES6+ JavaScript for zero build overhead.
   - Custom code block styling with language badges, copy-to-clipboard buttons, and syntax-like highlights.

2. **⚡ Real-Time Streaming Responses (SSE)**:
   - Token-by-token typewriter streaming via Server-Sent Events (`/api/chat/stream`).
   - Non-blocking asynchronous event generator powered by Python FastAPI.

3. **🎭 Multi-Persona Intelligence**:
   - 🤖 **General Assistant**: Balanced reasoning and general knowledge.
   - 💻 **Senior Code Architect**: Generates clean, production-ready code with complexity analysis.
   - 🎓 **Academic Tutor**: Explains complex computer science, math, and business concepts with intuitive analogies.
   - ✍️ **Creative & Content Writer**: Crafts persuasive copy, blog posts, essays, and stories.
   - 💼 **Career & Interview Coach**: Resume optimization and behavioral interview preparation using the STAR method.

4. **🎙️ Voice Interaction (Speech-to-Text & Text-to-Speech)**:
   - **Voice Input**: Click the microphone icon to dictate questions directly via Web Speech API (`webkitSpeechRecognition`).
   - **Voice Read-Aloud**: Click the "Read Aloud" button on any response to have the assistant speak it back using browser `speechSynthesis`.

5. **📄 Document Attachment & Q&A (RAG-Lite)**:
   - Upload PDF, CSV, TXT, or code files.
   - Automatically extracts and indexes textual contents using `pypdf` into conversational context memory.

6. **🧠 Dual AI Engine (Live & Offline)**:
   - **Google Gemini API**: Connect your free Google Gemini API key in Settings for live cloud generative AI.
   - **Offline Smart Intelligence Engine**: Zero-setup fallback engine that generates deep, formatted answers even without an internet connection or API key — ensuring 100% reliability during college vivas, live project demos, and portfolio reviews.

7. **💾 Session Persistence & Export**:
   - Saves all chats automatically in your browser's local storage.
   - Rename, switch, or delete previous conversation sessions.
   - 1-Click export to Markdown (`.md`) files.

---

## 🛠️ Architecture & Tech Stack

```text
┌─────────────────────────────────────────────────────────────┐
│                 Frontend (HTML5 / CSS3 / ES6)               │
│  - Dark Theme Glassmorphism, Inter / Outfit Typography      │
│  - SSE Streaming Consumer & Markdown Renderer               │
│  - Web Speech API (STT & TTS)                               │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / SSE Stream
┌──────────────────────────────▼──────────────────────────────┐
│                  Backend (Python FastAPI)                   │
│  - Asynchronous Uvicorn Server (Port 8000)                  │
│  - Endpoints: /api/chat/stream, /api/upload, /api/personas  │
│  - Document Extractor (pypdf for PDF, UTF-8 text parser)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌──────────────────────────────┐     ┌─────────────────────────────┐
│    Google Gemini API / Groq  │     │  Built-in Offline Engine    │
│  - Real-time LLM API         │     │  - Zero API Key Needed      │
│  - Streaming generation      │     │  - 100% Reliable for Demos  │
└──────────────────────────────┘     └─────────────────────────────┘
```

---

## 📁 Project Directory Structure

```text
Al-Powered Chatbot Assistant/
├── main.py              # FastAPI application server & REST/SSE endpoints
├── ai_engine.py         # AI provider dispatch (Gemini API & Offline Engine)
├── requirements.txt     # Python package dependencies
├── run.bat              # 1-Click launcher script for Windows
├── README.md            # Project guide and documentation
└── static/
    ├── index.html       # Single-page modern Chatbot web interface
    ├── style.css        # Glassmorphic dark styling & responsive rules
    └── app.js           # Client-side streaming controller, STT/TTS & state
```

---

## 🚀 How to Run the Project

### Method 1: 1-Click Windows Launcher (Easiest)
Simply double-click the **`run.bat`** file in the project folder. It will start the server and automatically launch your default browser at `http://localhost:8000`.

### Method 2: Terminal / Command Line
1. Open PowerShell or Command Prompt in this folder:
   ```bash
   cd "c:\Users\sacha\OneDrive\Desktop\Al-Powered Chatbot Assistant"
   ```
2. Start the FastAPI server:
   ```bash
   python main.py
   ```
3. Open your browser and navigate to:
   ```text
   http://localhost:8000
   ```

---

## 🔑 Setting up Live Google Gemini API (Optional)

1. Open the Chatbot in your browser.
2. Click the **Settings (⚙️)** button in the top right or sidebar footer.
3. Select **Google Gemini 1.5 Flash**.
4. Paste your free Gemini API key from [Google AI Studio](https://aistudio.google.com/).
5. Click **Save Changes**.
*(Note: If no API key is provided, the assistant continues to function smoothly using its built-in offline intelligence engine).*

---

## 🎓 Viva & Interview Talking Points

- **Why Server-Sent Events (SSE) over WebSockets?**: For a chatbot, streaming data is unidirectional (server to client). SSE is built on standard HTTP, supports automatic reconnection, and avoids the socket handshake complexity and proxy overhead of WebSockets.
- **How is Document Q&A implemented?**: Uploaded files are parsed by `pypdf` on the backend, truncated to fit the token window, and dynamically injected into the system instruction prompt alongside conversational memory.
- **Zero-Dependency Demo Reliability**: The system includes a decoupled heuristic intelligence engine so the project never fails in live viva situations if an API quota is exhausted or internet connectivity drops.
