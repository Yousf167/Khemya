@echo off
setlocal enabledelayedexpansion

REM =========================================================
REM Kheyma - Run with Visible Logs
REM =========================================================

set "SCRIPT_DIR=%~dp0"
set "BACKEND_DIR=%SCRIPT_DIR%kheyma_backend"
set "FRONTEND_DIR=%SCRIPT_DIR%kheyma_frontend"

REM Maven local repository
set "MAVEN_LOCAL_REPO=%BACKEND_DIR%\repository"
set "MAVEN_OPTS=%MAVEN_OPTS% -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"

echo =========================================================
echo Kheyma - Starting Services with Visible Logs
echo =========================================================
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
echo [INFO] Eureka will run in a separate window
cd /d "%BACKEND_DIR%\eureka-server"
start "Eureka Server - Port 8761" cmd /k "mvn spring-boot:run"
cd /d "%SCRIPT_DIR%"

echo [INFO] Waiting for Eureka to start (15 seconds)...
timeout /t 15 /nobreak >nul

echo [INFO] Starting API Gateway...
echo [INFO] Gateway will run in a separate window
cd /d "%BACKEND_DIR%\api-gateway"
start "API Gateway - Port 8085" cmd /k "mvn spring-boot:run"
cd /d "%SCRIPT_DIR%"

echo [INFO] Waiting for Gateway to start (5 seconds)...
timeout /t 5 /nobreak >nul

echo [INFO] Starting Kheyma Service (Main Backend)...
echo [INFO] Service will run in THIS window so you can see logs
echo [INFO] Press Ctrl+C to stop the service
echo.
echo =========================================================
echo Backend Service Logs (Port 8081)
echo =========================================================
echo.

cd /d "%BACKEND_DIR%\kheyma-service"
mvn spring-boot:run

cd /d "%SCRIPT_DIR%"
echo.
echo [INFO] Backend service stopped
pause

