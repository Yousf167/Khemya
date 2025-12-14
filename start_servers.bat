@echo off
setlocal enabledelayedexpansion

REM =========================================================
REM Kheyma - Server Startup Script (Windows)
REM =========================================================

REM ---------- Paths ----------
set "SCRIPT_DIR=%~dp0"
set "BACKEND_DIR=%SCRIPT_DIR%kheyma_backend"
set "FRONTEND_DIR=%SCRIPT_DIR%kheyma_frontend"

REM ---------- Maven ----------
set "MAVEN_LOCAL_REPO=%BACKEND_DIR%\repository"
set "MAVEN_OPTS=%MAVEN_OPTS% -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"

REM ---------- Jump to main ----------
goto :main


REM =========================================================
REM FUNCTIONS
REM =========================================================

:check_dependencies
set "MISSING="

where docker >nul 2>&1 || set "MISSING=%MISSING% docker"
where docker-compose >nul 2>&1 || set "MISSING=%MISSING% docker-compose"
where mvn >nul 2>&1 || set "MISSING=%MISSING% maven"
where node >nul 2>&1 || set "MISSING=%MISSING% node"
where npm >nul 2>&1 || set "MISSING=%MISSING% npm"

if not "%MISSING%"=="" (
    echo [WARNING] Missing:%MISSING%
)
exit /b 0


:check_port
netstat -an | findstr ":%1" | findstr "LISTENING" >nul 2>&1
exit /b %errorlevel%


:start_backend_docker
echo [INFO] Starting backend (Docker)...

if not exist "%BACKEND_DIR%\docker-compose.yml" (
    echo [ERROR] docker-compose.yml not found
    exit /b 1
)

cd /d "%BACKEND_DIR%"
docker-compose up -d || exit /b 1
cd /d "%SCRIPT_DIR%"

echo [SUCCESS] Backend running (Docker)
exit /b 0


:start_backend_maven
echo [INFO] Starting backend (Maven)...

cd /d "%BACKEND_DIR%\eureka-server"
start "Eureka Server" cmd /c "mvn spring-boot:run"

timeout /t 15 >nul

cd /d "%BACKEND_DIR%\api-gateway"
start "API Gateway" cmd /c "mvn spring-boot:run"

timeout /t 5 >nul

cd /d "%BACKEND_DIR%\kheyma-service"
start "Kheyma Service" cmd /c "mvn spring-boot:run"

cd /d "%SCRIPT_DIR%"
echo [SUCCESS] Backend running (Maven)
exit /b 0


:start_frontend
echo [INFO] Starting frontend...

cd /d "%FRONTEND_DIR%"

if not exist node_modules (
    npm install || exit /b 1
)

if not exist .env (
    echo VITE_API_BASE_URL=http://localhost:8081 > .env
)

start "Frontend Server" cmd /c "npm run dev"
cd /d "%SCRIPT_DIR%"

echo [SUCCESS] Frontend running
exit /b 0


:stop_all
echo [INFO] Stopping services...

docker-compose -f "%BACKEND_DIR%\docker-compose.yml" down >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq *Eureka*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq *Gateway*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq *Kheyma*" >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1

echo [SUCCESS] All services stopped
exit /b 0


:show_help
echo.
echo Usage: %~nx0 [command]
echo.
echo start           Start backend + frontend
echo docker          Start backend with Docker
echo maven           Start backend with Maven
echo frontend        Start frontend only
echo stop            Stop everything
echo status          Show ports
echo help            Show this help
echo.
exit /b 0


:show_status
echo.
call :check_port 27017 && echo MongoDB: RUNNING || echo MongoDB: STOPPED
call :check_port 8761 && echo Eureka: RUNNING || echo Eureka: STOPPED
call :check_port 8081 && echo Service: RUNNING || echo Service: STOPPED
call :check_port 8085 && echo Gateway: RUNNING || echo Gateway: STOPPED
call :check_port 5173 && echo Frontend: RUNNING || echo Frontend: STOPPED
echo.
exit /b 0


REM =========================================================
REM MAIN
REM =========================================================

:main
if "%1"=="" goto :show_help

if "%1"=="help" goto :show_help
if "%1"=="start" (
    call :check_dependencies
    call :start_backend_docker || call :start_backend_maven
    call :start_frontend
    exit /b 0
)

if "%1"=="docker" (
    call :start_backend_docker
    exit /b 0
)

if "%1"=="maven" (
    call :start_backend_maven
    exit /b 0
)

if "%1"=="frontend" (
    call :start_frontend
    exit /b 0
)

if "%1"=="stop" goto :stop_all
if "%1"=="status" goto :show_status

echo [ERROR] Unknown command: %1
goto :show_help
