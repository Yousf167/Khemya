#!/bin/bash

# Quick Start Script - Simple version
# Starts backend with Docker and frontend with npm

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/kheyma_backend"
FRONTEND_DIR="$SCRIPT_DIR/kheyma_frontend"

echo "🚀 Starting Kheyma servers..."
echo ""

# Start backend with Docker
echo "📦 Starting backend services (Docker)..."
cd "$BACKEND_DIR"
docker-compose up -d
echo "✅ Backend services started"
echo ""

# Wait a bit for services to initialize
echo "⏳ Waiting for services to initialize..."
sleep 10

# Start frontend
echo "🎨 Starting frontend server..."
cd "$FRONTEND_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📥 Installing frontend dependencies..."
    npm install
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    echo "VITE_API_BASE_URL=http://localhost:8081" > .env
fi

echo "✅ Starting frontend development server..."
npm run dev

