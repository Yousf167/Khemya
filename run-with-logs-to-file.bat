@echo off
setlocal enabledelayedexpansion

REM =========================================================
REM Kheyma - Run with Logs Saved to Files
REM =========================================================

set "SCRIPT_DIR=%~dp0"
set "BACKEND_DIR=%SCRIPT_DIR%kheyma_backend"
set "FRONTEND_DIR=%SCRIPT_DIR%kheyma_frontend"
set "LOG_DIR=%SCRIPT_DIR%logs"

REM Create logs directory
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

REM Maven local repository
set "MAVEN_LOCAL_REPO=%BACKEND_DIR%\repository"
set "MAVEN_OPTS=%MAVEN_OPTS% -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"

echo =========================================================
echo Kheyma - Starting Services with Log Files
echo =========================================================
echo.
echo [INFO] Logs will be saved to: %LOG_DIR%
echo.

REM Check if MongoDB is running
netstat -an | findstr ":27017" | findstr "LISTENING" >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] MongoDB doesn't appear to be running on port 27017
    echo [INFO] Make sure MongoDB is started before continuing
    echo.
    pause
)

echo [INFO] Starting Eureka Server...
cd /d "%BACKEND_DIR%\eureka-server"
start "Eureka Server" cmd /k "mvn spring-boot:run > %LOG_DIR%\eureka.log 2>&1"
cd /d "%SCRIPT_DIR%"

echo [INFO] Waiting for Eureka to start (15 seconds)...
timeout /t 15 /nobreak >nul

echo [INFO] Starting API Gateway...
cd /d "%BACKEND_DIR%\api-gateway"
start "API Gateway" cmd /k "mvn spring-boot:run > %LOG_DIR%\gateway.log 2>&1"
cd /d "%SCRIPT_DIR%"

echo [INFO] Waiting for Gateway to start (5 seconds)...
timeout /t 5 /nobreak >nul

echo [INFO] Starting Kheyma Service...
echo [INFO] Logs will be saved to: %LOG_DIR%\service.log
echo [INFO] Service will run in THIS window
echo [INFO] Press Ctrl+C to stop
echo.
echo =========================================================
echo Backend Service Logs (Port 8081)
echo =========================================================
echo.

cd /d "%BACKEND_DIR%\kheyma-service"
mvn spring-boot:run > "%LOG_DIR%\service.log" 2>&1

cd /d "%SCRIPT_DIR%"
echo.
echo [INFO] Backend service stopped
echo [INFO] Logs saved to: %LOG_DIR%
pause

