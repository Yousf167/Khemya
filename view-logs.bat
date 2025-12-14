@echo off
REM View backend service logs

echo ========================================
echo Kheyma Backend Service Logs
echo ========================================
echo.

REM Check if running in Docker
docker ps | findstr "kheyma-service" >nul 2>&1
if %errorlevel% == 0 (
    echo [INFO] Service is running in Docker
    echo [INFO] Showing Docker logs (Ctrl+C to exit)...
    echo.
    docker-compose -f kheyma_backend\docker-compose.yml logs -f kheyma-service
    goto :end
)

REM Check for log file
if exist ".service.log" (
    echo [INFO] Found log file: .service.log
    echo [INFO] Showing logs (Ctrl+C to exit)...
    echo.
    powershell -Command "Get-Content .service.log -Wait -Tail 50"
    goto :end
)

REM Check if service is running
netstat -an | findstr ":8081" | findstr "LISTENING" >nul 2>&1
if %errorlevel% == 0 (
    echo [INFO] Service is running on port 8081
    echo [INFO] Logs should be visible in the terminal/console where you started the service
    echo.
    echo If you started it with start_servers.bat, look for the "Kheyma Service" window
    echo If you started it manually, check that terminal window
    echo.
    echo To see real-time logs, you can:
    echo 1. Check the console/terminal where the service is running
    echo 2. Or restart the service and redirect output to a log file:
    echo    cd kheyma_backend\kheyma-service
    echo    mvn spring-boot:run ^> ..\..\service.log 2^>^&1
) else (
    echo [ERROR] Service is not running on port 8081
    echo [INFO] Start the service first with: start_servers.bat maven
)

:end
pause

