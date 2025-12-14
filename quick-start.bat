@echo off
REM Quick Start Script for Windows
REM Simple version - Starts backend with Docker and frontend with npm

setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "BACKEND_DIR=%SCRIPT_DIR%kheyma_backend"
set "FRONTEND_DIR=%SCRIPT_DIR%kheyma_frontend"

echo 🚀 Starting Kheyma servers...
echo.

REM Start backend with Docker
echo 📦 Starting backend services (Docker)...
cd /d "%BACKEND_DIR%"
docker-compose up -d
if errorlevel 1 (
    echo ❌ Failed to start backend services
    pause
    exit /b 1
)
echo ✅ Backend services started
echo.

REM Wait a bit for services to initialize
echo ⏳ Waiting for services to initialize...
timeout /t 10 /nobreak >nul

REM Start frontend
echo 🎨 Starting frontend server...
cd /d "%FRONTEND_DIR%"

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📥 Installing frontend dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Create .env if it doesn't exist
if not exist ".env" (
    echo 📝 Creating .env file...
    echo VITE_API_BASE_URL=http://localhost:8081 > .env
)

echo ✅ Starting frontend development server...
call npm run dev

pause
