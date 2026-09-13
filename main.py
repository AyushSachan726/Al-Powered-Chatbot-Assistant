"""
AI-Powered Chatbot Assistant - FastAPI Server
Serves both modern Web UI and high-performance Streaming REST APIs.
"""

import os
import io
import json
import uvicorn
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import HTMLResponse, StreamingResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader

from ai_engine import ai_engine, PERSONAS

# Initialize FastAPI App
app = FastAPI(
    title="AI-Powered Chatbot Assistant API",
    description="Backend API powering the intelligent multi-persona chatbot assistant with streaming & voice support",
    version="1.0.0"
)

# CORS Middleware to allow flexible access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure static directory exists
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(STATIC_DIR, exist_ok=True)


# --- Request & Response Models ---
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    persona: str = "general"
    doc_context: Optional[str] = None
    api_key: Optional[str] = None
    provider: str = "gemini"


# --- API Routes ---

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "AI-Powered Chatbot Assistant",
        "personas_available": len(PERSONAS),
        "version": "1.0.0"
    }


@app.get("/api/personas")
async def get_personas():
    """Return all available AI personas with metadata"""
    return JSONResponse(content=list(PERSONAS.values()))


@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    """Standard non-streaming chat endpoint"""
    try:
        dict_messages = [{"role": m.role, "content": m.content} for m in request.messages]
        response_text = await ai_engine.generate_response(
            messages=dict_messages,
            persona_id=request.persona,
            doc_context=request.doc_context,
            api_key=request.api_key,
            provider=request.provider
        )
        return {"response": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat/stream")
async def chat_stream_endpoint(request: ChatRequest):
    """
    Server-Sent Events (SSE) streaming endpoint.
    Yields JSON data chunks with 'token' and finished state.
    """
    dict_messages = [{"role": m.role, "content": m.content} for m in request.messages]

    async def event_generator():
        try:
            async for token in ai_engine.generate_stream(
                messages=dict_messages,
                persona_id=request.persona,
                doc_context=request.doc_context,
                api_key=request.api_key,
                provider=request.provider
            ):
                payload = json.dumps({"token": token})
                yield f"data: {payload}\n\n"
            # Send completion marker
            yield f"data: {json.dumps({'done': True})}\n\n"
        except Exception as e:
            error_payload = json.dumps({"error": str(e), "done": True})
            yield f"data: {error_payload}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Upload and parse documents (PDF, TXT, CSV, MD).
    Returns extracted text context and metadata.
    """
    filename = file.filename.lower()
    content_bytes = await file.read()
    extracted_text = ""

    try:
        if filename.endswith(".pdf"):
            reader = PdfReader(io.BytesIO(content_bytes))
            pages_text = []
            for i, page in enumerate(reader.pages):
                txt = page.extract_text() or ""
                if txt.strip():
                    pages_text.append(f"--- Page {i+1} ---\n{txt}")
            extracted_text = "\n\n".join(pages_text)
        else:
            # Handle text, md, csv, py, js, etc.
            extracted_text = content_bytes.decode("utf-8", errors="ignore")

        # Basic cleanup & limit context size for performance
        cleaned = extracted_text.strip()
        word_count = len(cleaned.split())
        
        # Limit to reasonable token count if very long
        if word_count > 8000:
            words = cleaned.split()[:8000]
            cleaned = " ".join(words) + "\n\n... [Content truncated to top 8,000 words] ..."

        return {
            "status": "success",
            "filename": file.filename,
            "word_count": word_count,
            "text": cleaned
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process document: {str(e)}")


# Serve static web frontend
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/", response_class=HTMLResponse)
async def serve_ui():
    """Serves the main application single page interface"""
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse("<h1>AI-Powered Chatbot Assistant UI is loading...</h1>")


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"[*] Starting AI-Powered Chatbot Assistant on http://localhost:{port}")
    uvicorn.run("main:app", host="127.0.0.1", port=port, reload=True)
