@echo off
title AI-Powered Chatbot Assistant Launcher
echo ========================================================
echo        AI-Powered Chatbot Assistant (Nexus AI)
echo ========================================================
echo.
echo [*] Checking Python environment...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Python was not found in PATH. Please install Python 3.10+ from python.org.
    pause
    exit /b 1
)

echo [*] Starting FastAPI server on http://localhost:8000 ...
start "" "http://localhost:8000"
python main.py

pause
