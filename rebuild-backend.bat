@echo off
REM Rebuild Backend Script for Windows
REM Rebuilds and restarts Kheyma backend service

echo Rebuilding and restarting Kheyma backend service...
echo.

cd /d "%~dp0kheyma_backend"

REM Stop the service
echo Stopping kheyma-service container...
docker-compose stop kheyma-service

REM Rebuild the service with new code
echo Rebuilding kheyma-service...
docker-compose build --no-cache kheyma-service

REM Start the service
echo Starting kheyma-service...
docker-compose up -d kheyma-service

echo Waiting for service to start...
timeout /t 10 /nobreak >nul

echo Checking service status...
docker-compose ps kheyma-service

echo.
echo Backend service rebuilt and restarted!
echo Test with: curl -X POST http://localhost:8081/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"secret123\"}"

pause
