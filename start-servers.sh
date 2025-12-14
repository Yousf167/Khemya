#!/bin/bash

# Kheyma - Server Startup Script
# This script helps you start the backend and frontend servers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/kheyma_backend"
FRONTEND_DIR="$SCRIPT_DIR/kheyma_frontend"

# Maven local repository in project directory
MAVEN_LOCAL_REPO="$BACKEND_DIR/repository"
export MAVEN_OPTS="${MAVEN_OPTS} -Dmaven.repo.local=${MAVEN_LOCAL_REPO}"

# PID files for tracking processes
BACKEND_PID_FILE="$SCRIPT_DIR/.backend.pid"
FRONTEND_PID_FILE="$SCRIPT_DIR/.frontend.pid"

# Function to print colored messages
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check dependencies
check_dependencies() {
    local missing_deps=()
    
    if ! command_exists docker; then
        missing_deps+=("docker")
    fi
    
    if ! command_exists docker-compose; then
        missing_deps+=("docker-compose")
    fi
    
    if ! command_exists mvn; then
        missing_deps+=("maven")
    fi
    
    if ! command_exists node; then
        missing_deps+=("node")
    fi
    
    if ! command_exists npm; then
        missing_deps+=("npm")
    fi
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        print_warning "Missing dependencies: ${missing_deps[*]}"
        print_info "Some features may not work without these dependencies"
        return 1
    fi
    
    return 0
}

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to start backend with Docker Compose
start_backend_docker() {
    print_info "Starting backend services with Docker Compose..."
    
    if [ ! -f "$BACKEND_DIR/docker-compose.yml" ]; then
        print_error "docker-compose.yml not found in $BACKEND_DIR"
        return 1
    fi
    
    cd "$BACKEND_DIR"
    
    # Check if services are already running
    if docker-compose ps | grep -q "Up"; then
        print_warning "Backend services are already running"
        return 0
    fi
    
    # Start services
    docker-compose up -d
    
    print_success "Backend services started with Docker Compose"
    print_info "Services:"
    print_info "  - MongoDB: localhost:27017"
    print_info "  - Eureka Server: http://localhost:8761"
    print_info "  - API Gateway: http://localhost:8085"
    print_info "  - Kheyma Service: http://localhost:8081/api"
    
    cd "$SCRIPT_DIR"
}

# Function to start backend with Maven
start_backend_maven() {
    print_info "Starting backend services with Maven..."
    
    if [ ! -d "$BACKEND_DIR" ]; then
        print_error "Backend directory not found: $BACKEND_DIR"
        return 1
    fi
    
    # Check if Maven is available
    if ! command_exists mvn; then
        print_error "Maven is not installed. Please install Maven or use Docker Compose option."
        return 1
    fi
    
    # Start Eureka Server
    print_info "Starting Eureka Server..."
    cd "$BACKEND_DIR/eureka-server"
    mvn spring-boot:run > "$SCRIPT_DIR/.eureka.log" 2>&1 &
    echo $! > "$SCRIPT_DIR/.eureka.pid"
    
    # Wait for Eureka to start
    print_info "Waiting for Eureka Server to start..."
    sleep 15
    
    # Start API Gateway
    print_info "Starting API Gateway..."
    cd "$BACKEND_DIR/api-gateway"
    mvn spring-boot:run > "$SCRIPT_DIR/.gateway.log" 2>&1 &
    echo $! > "$SCRIPT_DIR/.gateway.pid"
    
    # Wait a bit for gateway
    sleep 5
    
    # Start Kheyma Service
    print_info "Starting Kheyma Service..."
    cd "$BACKEND_DIR/kheyma-service"
    mvn spring-boot:run > "$SCRIPT_DIR/.service.log" 2>&1 &
    echo $! > "$SCRIPT_DIR/.service.pid"
    
    print_success "Backend services started with Maven"
    print_info "Services:"
    print_info "  - Eureka Server: http://localhost:8761"
    print_info "  - API Gateway: http://localhost:8085"
    print_info "  - Kheyma Service: http://localhost:8081/api"
    print_info "Logs are in: $SCRIPT_DIR/.eureka.log, .gateway.log, .service.log"
    
    cd "$SCRIPT_DIR"
}

# Function to start frontend
start_frontend() {
    print_info "Starting frontend development server..."
    
    if [ ! -d "$FRONTEND_DIR" ]; then
        print_error "Frontend directory not found: $FRONTEND_DIR"
        return 1
    fi
    
    # Check if node_modules exists
    if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
        print_warning "node_modules not found. Installing dependencies..."
        cd "$FRONTEND_DIR"
        npm install
    fi
    
    # Check if .env file exists
    if [ ! -f "$FRONTEND_DIR/.env" ]; then
        print_warning ".env file not found. Creating from template..."
        echo "VITE_API_BASE_URL=http://localhost:8081" > "$FRONTEND_DIR/.env"
        print_info "Created .env file. You can modify it if needed."
    fi
    
    cd "$FRONTEND_DIR"
    npm run dev > "$SCRIPT_DIR/.frontend.log" 2>&1 &
    echo $! > "$FRONTEND_PID_FILE"
    
    print_success "Frontend server started"
    print_info "Frontend: http://localhost:5173"
    print_info "Logs are in: $SCRIPT_DIR/.frontend.log"
    
    cd "$SCRIPT_DIR"
}

# Function to stop backend (Docker)
stop_backend_docker() {
    print_info "Stopping backend services (Docker)..."
    cd "$BACKEND_DIR"
    docker-compose down
    print_success "Backend services stopped"
    cd "$SCRIPT_DIR"
}

# Function to stop backend (Maven)
stop_backend_maven() {
    print_info "Stopping backend services (Maven)..."
    
    if [ -f "$SCRIPT_DIR/.eureka.pid" ]; then
        kill $(cat "$SCRIPT_DIR/.eureka.pid") 2>/dev/null || true
        rm "$SCRIPT_DIR/.eureka.pid"
    fi
    
    if [ -f "$SCRIPT_DIR/.gateway.pid" ]; then
        kill $(cat "$SCRIPT_DIR/.gateway.pid") 2>/dev/null || true
        rm "$SCRIPT_DIR/.gateway.pid"
    fi
    
    if [ -f "$SCRIPT_DIR/.service.pid" ]; then
        kill $(cat "$SCRIPT_DIR/.service.pid") 2>/dev/null || true
        rm "$SCRIPT_DIR/.service.pid"
    fi
    
    # Kill any remaining Java processes (Spring Boot)
    pkill -f "spring-boot:run" 2>/dev/null || true
    
    print_success "Backend services stopped"
}

# Function to stop frontend
stop_frontend() {
    print_info "Stopping frontend server..."
    
    if [ -f "$FRONTEND_PID_FILE" ]; then
        kill $(cat "$FRONTEND_PID_FILE") 2>/dev/null || true
        rm "$FRONTEND_PID_FILE"
    fi
    
    # Kill any remaining Vite processes
    pkill -f "vite" 2>/dev/null || true
    
    print_success "Frontend server stopped"
}

# Function to cleanup on exit
cleanup() {
    print_info "Cleaning up..."
    stop_backend_maven
    stop_frontend
    exit 0
}

# Trap signals for cleanup
trap cleanup SIGINT SIGTERM

# Function to show status
show_status() {
    print_info "Service Status:"
    echo ""
    
    # Check Docker services
    if command_exists docker-compose && [ -f "$BACKEND_DIR/docker-compose.yml" ]; then
        cd "$BACKEND_DIR"
        if docker-compose ps | grep -q "Up"; then
            print_success "Backend (Docker): Running"
            docker-compose ps
        else
            print_warning "Backend (Docker): Not running"
        fi
        cd "$SCRIPT_DIR"
    fi
    
    # Check Maven processes
    if pgrep -f "spring-boot:run" > /dev/null; then
        print_success "Backend (Maven): Running"
    else
        print_warning "Backend (Maven): Not running"
    fi
    
    # Check frontend
    if [ -f "$FRONTEND_PID_FILE" ] && kill -0 $(cat "$FRONTEND_PID_FILE") 2>/dev/null; then
        print_success "Frontend: Running (PID: $(cat $FRONTEND_PID_FILE))"
    elif pgrep -f "vite" > /dev/null; then
        print_success "Frontend: Running"
    else
        print_warning "Frontend: Not running"
    fi
    
    echo ""
    print_info "Port Status:"
    for port in 27017 8761 8081 8085 5173; do
        if check_port $port; then
            print_success "Port $port: In use"
        else
            print_warning "Port $port: Free"
        fi
    done
}

# Function to show help
show_help() {
    echo "Kheyma Server Startup Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  start              Start both backend and frontend"
    echo "  start-backend      Start only backend services"
    echo "  start-frontend     Start only frontend server"
    echo "  stop               Stop all services"
    echo "  stop-backend       Stop backend services"
    echo "  stop-frontend      Stop frontend server"
    echo "  restart            Restart all services"
    echo "  status             Show status of all services"
    echo "  docker             Start backend with Docker Compose"
    echo "  maven              Start backend with Maven"
    echo "  logs               Show logs (backend/frontend/all)"
    echo "  help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start           # Start everything"
    echo "  $0 docker          # Start backend with Docker"
    echo "  $0 maven           # Start backend with Maven"
    echo "  $0 status          # Check service status"
}

# Function to show logs
show_logs() {
    local service=$1
    
    case $service in
        backend|eureka)
            if [ -f "$SCRIPT_DIR/.eureka.log" ]; then
                tail -f "$SCRIPT_DIR/.eureka.log"
            else
                print_error "Eureka log file not found"
            fi
            ;;
        gateway)
            if [ -f "$SCRIPT_DIR/.gateway.log" ]; then
                tail -f "$SCRIPT_DIR/.gateway.log"
            else
                print_error "Gateway log file not found"
            fi
            ;;
        service)
            if [ -f "$SCRIPT_DIR/.service.log" ]; then
                tail -f "$SCRIPT_DIR/.service.log"
            else
                print_error "Service log file not found"
            fi
            ;;
        frontend)
            if [ -f "$SCRIPT_DIR/.frontend.log" ]; then
                tail -f "$SCRIPT_DIR/.frontend.log"
            else
                print_error "Frontend log file not found"
            fi
            ;;
        all)
            print_info "Showing all logs (Ctrl+C to exit)..."
            tail -f "$SCRIPT_DIR"/.eureka.log "$SCRIPT_DIR"/.gateway.log "$SCRIPT_DIR"/.service.log "$SCRIPT_DIR"/.frontend.log 2>/dev/null || print_warning "Some log files not found"
            ;;
        *)
            print_error "Unknown service: $service"
            print_info "Available: backend, eureka, gateway, service, frontend, all"
            ;;
    esac
}

# Main script logic
main() {
    case "${1:-help}" in
        start)
            check_dependencies
            print_info "Starting all services..."
            start_backend_docker || start_backend_maven
            sleep 5
            start_frontend
            print_success "All services started!"
            print_info "Press Ctrl+C to stop all services"
            wait
            ;;
        start-backend)
            check_dependencies
            if [ "${2:-docker}" == "docker" ]; then
                start_backend_docker
            else
                start_backend_maven
            fi
            ;;
        start-frontend)
            start_frontend
            ;;
        stop)
            stop_backend_docker
            stop_backend_maven
            stop_frontend
            ;;
        stop-backend)
            stop_backend_docker
            stop_backend_maven
            ;;
        stop-frontend)
            stop_frontend
            ;;
        restart)
            print_info "Restarting all services..."
            stop_backend_docker
            stop_backend_maven
            stop_frontend
            sleep 2
            start_backend_docker || start_backend_maven
            sleep 5
            start_frontend
            ;;
        status)
            show_status
            ;;
        docker)
            start_backend_docker
            ;;
        maven)
            start_backend_maven
            ;;
        logs)
            show_logs "${2:-all}"
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"

