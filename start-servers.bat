@echo off
REM Kheyma - Server Startup Script for Windows
REM This script helps you start the backend and frontend servers

setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "BACKEND_DIR=%SCRIPT_DIR%kheyma_backend"
set "FRONTEND_DIR=%SCRIPT_DIR%kheyma_frontend"

REM Maven local repository in project directory
set "MAVEN_LOCAL_REPO=%BACKEND_DIR%\repository"
set "MAVEN_OPTS=%MAVEN_OPTS% -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"

REM PID files for tracking processes
set "BACKEND_PID_FILE=%SCRIPT_DIR%.backend.pid"
set "FRONTEND_PID_FILE=%SCRIPT_DIR%.frontend.pid"

REM Check if a command exists
:check_command
where %1 >nul 2>&1
exit /b %errorlevel%

REM Check dependencies
:check_dependencies
set "MISSING_DEPS="

where docker >nul 2>&1
if errorlevel 1 set "MISSING_DEPS=%MISSING_DEPS% docker"

where docker-compose >nul 2>&1
if errorlevel 1 set "MISSING_DEPS=%MISSING_DEPS% docker-compose"

where mvn >nul 2>&1
if errorlevel 1 set "MISSING_DEPS=%MISSING_DEPS% maven"

where node >nul 2>&1
if errorlevel 1 set "MISSING_DEPS=%MISSING_DEPS% node"

where npm >nul 2>&1
if errorlevel 1 set "MISSING_DEPS=%MISSING_DEPS% npm"

if not "%MISSING_DEPS%"=="" (
    echo [WARNING] Missing dependencies:%MISSING_DEPS%
    echo [INFO] Some features may not work without these dependencies
    exit /b 1
)
exit /b 0

REM Check if port is in use
:check_port
netstat -an | findstr ":%1" | findstr "LISTENING" >nul 2>&1
exit /b %errorlevel%

REM Start backend with Docker Compose
:start_backend_docker
echo [INFO] Starting backend services with Docker Compose...

if not exist "%BACKEND_DIR%\docker-compose.yml" (
    echo [ERROR] docker-compose.yml not found in %BACKEND_DIR%
    exit /b 1
)

cd /d "%BACKEND_DIR%"

REM Check if services are already running
docker-compose ps | findstr "Up" >nul 2>&1
if not errorlevel 1 (
    echo [WARNING] Backend services are already running
    cd /d "%SCRIPT_DIR%"
    exit /b 0
)

REM Start services
docker-compose up -d
if errorlevel 1 (
    echo [ERROR] Failed to start backend services
    cd /d "%SCRIPT_DIR%"
    exit /b 1
)

echo [SUCCESS] Backend services started with Docker Compose
echo [INFO] Services:
echo [INFO]   - MongoDB: localhost:27017
echo [INFO]   - Eureka Server: http://localhost:8761
echo [INFO]   - API Gateway: http://localhost:8085
echo [INFO]   - Kheyma Service: http://localhost:8081/api

cd /d "%SCRIPT_DIR%"
exit /b 0

REM Start backend with Maven
:start_backend_maven
echo [INFO] Starting backend services with Maven...

if not exist "%BACKEND_DIR%" (
    echo [ERROR] Backend directory not found: %BACKEND_DIR%
    exit /b 1
)

REM Check if Maven is available
where mvn >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Maven is not installed. Please install Maven or use Docker Compose option.
    exit /b 1
)

REM Start Eureka Server
echo [INFO] Starting Eureka Server...
cd /d "%BACKEND_DIR%\eureka-server"
start "Eureka Server" /min cmd /c "set MAVEN_OPTS=-Dmaven.repo.local=%MAVEN_LOCAL_REPO% && mvn spring-boot:run > %SCRIPT_DIR%\.eureka.log 2>&1"

REM Wait for Eureka to start
echo [INFO] Waiting for Eureka Server to start...
timeout /t 15 /nobreak >nul

REM Start API Gateway
echo [INFO] Starting API Gateway...
cd /d "%BACKEND_DIR%\api-gateway"
start "API Gateway" /min cmd /c "set MAVEN_OPTS=-Dmaven.repo.local=%MAVEN_LOCAL_REPO% && mvn spring-boot:run > %SCRIPT_DIR%\.gateway.log 2>&1"

REM Wait a bit for gateway
timeout /t 5 /nobreak >nul

REM Start Kheyma Service
echo [INFO] Starting Kheyma Service...
cd /d "%BACKEND_DIR%\kheyma-service"
start "Kheyma Service" /min cmd /c "set MAVEN_OPTS=-Dmaven.repo.local=%MAVEN_LOCAL_REPO% && mvn spring-boot:run > %SCRIPT_DIR%\.service.log 2>&1"

echo [SUCCESS] Backend services started with Maven
echo [INFO] Services:
echo [INFO]   - Eureka Server: http://localhost:8761
echo [INFO]   - API Gateway: http://localhost:8085
echo [INFO]   - Kheyma Service: http://localhost:8081/api
echo [INFO] Logs are in: %SCRIPT_DIR%\.eureka.log, .gateway.log, .service.log

cd /d "%SCRIPT_DIR%"
exit /b 0

REM Start frontend
:start_frontend
echo [INFO] Starting frontend development server...

if not exist "%FRONTEND_DIR%" (
    echo [ERROR] Frontend directory not found: %FRONTEND_DIR%
    exit /b 1
)

REM Check if node_modules exists
if not exist "%FRONTEND_DIR%\node_modules" (
    echo [WARNING] node_modules not found. Installing dependencies...
    cd /d "%FRONTEND_DIR%"
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        cd /d "%SCRIPT_DIR%"
        exit /b 1
    )
)

REM Check if .env file exists
if not exist "%FRONTEND_DIR%\.env" (
    echo [WARNING] .env file not found. Creating from template...
    echo VITE_API_BASE_URL=http://localhost:8081 > "%FRONTEND_DIR%\.env"
    echo [INFO] Created .env file. You can modify it if needed.
)

cd /d "%FRONTEND_DIR%"
start "Frontend Server" cmd /c "npm run dev > %SCRIPT_DIR%\.frontend.log 2>&1"

echo [SUCCESS] Frontend server started
echo [INFO] Frontend: http://localhost:5173
echo [INFO] Logs are in: %SCRIPT_DIR%\.frontend.log

cd /d "%SCRIPT_DIR%"
exit /b 0

REM Stop backend (Docker)
:stop_backend_docker
echo [INFO] Stopping backend services (Docker)...
cd /d "%BACKEND_DIR%"
docker-compose down
echo [SUCCESS] Backend services stopped
cd /d "%SCRIPT_DIR%"
exit /b 0

REM Stop backend (Maven)
:stop_backend_maven
echo [INFO] Stopping backend services (Maven)...

REM Kill Java processes (Spring Boot)
taskkill /F /FI "WINDOWTITLE eq Eureka Server*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq API Gateway*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq Kheyma Service*" >nul 2>&1

REM Kill any remaining Java processes with spring-boot:run
for /f "tokens=2" %%a in ('tasklist /FI "IMAGENAME eq java.exe" /FO LIST ^| findstr /C:"PID:"') do (
    wmic process where "ProcessId=%%a" get CommandLine 2>nul | findstr "spring-boot:run" >nul
    if not errorlevel 1 (
        taskkill /F /PID %%a >nul 2>&1
    )
)

echo [SUCCESS] Backend services stopped
exit /b 0

REM Stop frontend
:stop_frontend
echo [INFO] Stopping frontend server...

taskkill /F /FI "WINDOWTITLE eq Frontend Server*" >nul 2>&1

REM Kill any remaining node processes (Vite)
for /f "tokens=2" %%a in ('tasklist /FI "IMAGENAME eq node.exe" /FO LIST ^| findstr /C:"PID:"') do (
    wmic process where "ProcessId=%%a" get CommandLine 2>nul | findstr "vite" >nul
    if not errorlevel 1 (
        taskkill /F /PID %%a >nul 2>&1
    )
)

echo [SUCCESS] Frontend server stopped
exit /b 0

REM Show status
:show_status
echo [INFO] Service Status:
echo.

REM Check Docker services
where docker-compose >nul 2>&1
if not errorlevel 1 (
    if exist "%BACKEND_DIR%\docker-compose.yml" (
        cd /d "%BACKEND_DIR%"
        docker-compose ps | findstr "Up" >nul 2>&1
        if not errorlevel 1 (
            echo [SUCCESS] Backend (Docker): Running
            docker-compose ps
        ) else (
            echo [WARNING] Backend (Docker): Not running
        )
        cd /d "%SCRIPT_DIR%"
    )
)

REM Check Maven processes
tasklist /FI "IMAGENAME eq java.exe" 2>nul | findstr "java.exe" >nul
if not errorlevel 1 (
    echo [SUCCESS] Backend (Maven): Running (check individual services)
) else (
    echo [WARNING] Backend (Maven): Not running
)

REM Check frontend
tasklist /FI "IMAGENAME eq node.exe" 2>nul | findstr "node.exe" >nul
if not errorlevel 1 (
    echo [SUCCESS] Frontend: Running
) else (
    echo [WARNING] Frontend: Not running
)

echo.
echo [INFO] Port Status:
call :check_port 27017
if not errorlevel 1 (echo [SUCCESS] Port 27017: In use) else (echo [WARNING] Port 27017: Free)
call :check_port 8761
if not errorlevel 1 (echo [SUCCESS] Port 8761: In use) else (echo [WARNING] Port 8761: Free)
call :check_port 8081
if not errorlevel 1 (echo [SUCCESS] Port 8081: In use) else (echo [WARNING] Port 8081: Free)
call :check_port 8085
if not errorlevel 1 (echo [SUCCESS] Port 8085: In use) else (echo [WARNING] Port 8085: Free)
call :check_port 5173
if not errorlevel 1 (echo [SUCCESS] Port 5173: In use) else (echo [WARNING] Port 5173: Free)

exit /b 0

REM Show help
:show_help
echo Kheyma Server Startup Script
echo.
echo Usage: %~nx0 [OPTION]
echo.
echo Options:
echo   start              Start both backend and frontend
echo   start-backend      Start only backend services
echo   start-frontend     Start only frontend server
echo   stop               Stop all services
echo   stop-backend       Stop backend services
echo   stop-frontend      Stop frontend server
echo   restart            Restart all services
echo   status             Show status of all services
echo   docker             Start backend with Docker Compose
echo   maven              Start backend with Maven
echo   help               Show this help message
echo.
echo Examples:
echo   %~nx0 start           # Start everything
echo   %~nx0 docker          # Start backend with Docker
echo   %~nx0 maven           # Start backend with Maven
echo   %~nx0 status          # Check service status
exit /b 0

REM Main script logic
if "%1"=="" goto :help
if "%1"=="help" goto :help
if "%1"=="--help" goto :help
if "%1"=="-h" goto :help

if "%1"=="start" goto :start_all
if "%1"=="start-backend" goto :start_backend_only
if "%1"=="start-frontend" goto :start_frontend_only
if "%1"=="stop" goto :stop_all
if "%1"=="stop-backend" goto :stop_backend_only
if "%1"=="stop-frontend" goto :stop_frontend_only
if "%1"=="restart" goto :restart_all
if "%1"=="status" goto :show_status
if "%1"=="docker" goto :start_docker
if "%1"=="maven" goto :start_maven

echo [ERROR] Unknown option: %1
call :show_help
exit /b 1

:start_all
call :check_dependencies
if errorlevel 1 (
    echo [WARNING] Some dependencies are missing, but continuing...
)
echo [INFO] Starting all services...
call :start_backend_docker
if errorlevel 1 (
    call :start_backend_maven
)
timeout /t 5 /nobreak >nul
call :start_frontend
echo [SUCCESS] All services started!
echo [INFO] Press Ctrl+C to stop all services
pause
exit /b 0

:start_backend_only
call :check_dependencies
if errorlevel 1 (
    echo [WARNING] Some dependencies are missing, but continuing...
)
if "%2"=="maven" (
    call :start_backend_maven
) else (
    call :start_backend_docker
    if errorlevel 1 (
        call :start_backend_maven
    )
)
exit /b 0

:start_frontend_only
call :start_frontend
exit /b 0

:stop_all
call :stop_backend_docker
call :stop_backend_maven
call :stop_frontend
exit /b 0

:stop_backend_only
call :stop_backend_docker
call :stop_backend_maven
exit /b 0

:stop_frontend_only
call :stop_frontend
exit /b 0

:restart_all
echo [INFO] Restarting all services...
call :stop_backend_docker
call :stop_backend_maven
call :stop_frontend
timeout /t 2 /nobreak >nul
call :start_backend_docker
if errorlevel 1 (
    call :start_backend_maven
)
timeout /t 5 /nobreak >nul
call :start_frontend
exit /b 0

:start_docker
call :start_backend_docker
exit /b 0

:start_maven
call :start_backend_maven
exit /b 0

:help
call :show_help
exit /b 0
