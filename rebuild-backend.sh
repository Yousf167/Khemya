#!/usr/bin/bash

echo "Rebuilding and restarting Kheyma backend service..."

cd "$(dirname "$0")/kheyma_backend"

# Stop the service
echo "Stopping kheyma-service container..."
sudo docker-compose stop kheyma-service

# Rebuild the service with new code
echo "Rebuilding kheyma-service..."
sudo docker-compose build --no-cache kheyma-service

# Start the service
echo "Starting kheyma-service..."
sudo docker-compose up -d kheyma-service

echo "Waiting for service to start..."
sleep 10

echo "Checking service status..."
sudo docker-compose ps kheyma-service

echo ""
echo "Backend service rebuilt and restarted!"
echo "Test with: curl -X POST http://localhost:8081/api/auth/register -H 'Content-Type: application/json' -d '{\"email\":\"test@example.com\",\"password\":\"secret123\"}'"
