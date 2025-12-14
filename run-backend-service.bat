@echo off
setlocal enabledelayedexpansion

REM =========================================================
REM Run ONLY the Backend Service with Visible Logs
REM Use this if Eureka and Gateway are already running
REM =========================================================

set "SCRIPT_DIR=%~dp0"
set "BACKEND_DIR=%SCRIPT_DIR%kheyma_backend"

REM Maven local repository
set "MAVEN_LOCAL_REPO=%BACKEND_DIR%\repository"
set "MAVEN_OPTS=%MAVEN_OPTS% -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"

echo =========================================================
echo Starting Kheyma Backend Service
echo Port: 8081
echo =========================================================
echo.
echo [INFO] Logs will appear below
echo [INFO] Press Ctrl+C to stop
echo.
echo =========================================================
echo.

cd /d "%BACKEND_DIR%\kheyma-service"
mvn spring-boot:run

cd /d "%SCRIPT_DIR%"
pause

