#!/bin/bash

# Display a step banner
function step() {
  echo ""
  echo "=========================================="
  echo "STEP: $1"
  echo "=========================================="
}

# Check for docker and docker-compose installation
step "Checking Docker installation"
if ! command -v docker &> /dev/null; then
  echo "Docker is not installed. Please install Docker first."
  exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
  echo "Docker Compose is not installed. Please install Docker Compose first."
  exit 1
fi

echo "Docker and Docker Compose are installed!"

# Create the backend Dockerfile if it doesn't exist
step "Creating backend Dockerfile"
if [ ! -f "backend/Dockerfile" ]; then
  cat > backend/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Run migrations and start server
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:3000"]

EXPOSE 3000
EOF
  echo "Backend Dockerfile created."
else
  echo "Backend Dockerfile already exists."
fi

# Create frontend Dockerfile if it doesn't exist
step "Creating frontend Dockerfile"
if [ ! -f "frontend/Dockerfile" ]; then
  cat > frontend/Dockerfile << 'EOF'
# =============== Build stage =============== 
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . ./

# Build the application
RUN npm run build

# =============== Production stage ===============
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
EOF
  echo "Frontend Dockerfile created."
else
  echo "Frontend Dockerfile already exists."
fi

# Create the docker-compose.yml file
step "Creating docker-compose.yml"
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # Frontend application
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - '80:80'
    depends_on:
      - backend
    environment:
      - VITE_API_BASE_URL=${API_URL:-http://localhost:3000}
    restart: unless-stopped
    networks:
      - app-network

  # Backend API service
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - '3000:3000'
    depends_on:
      db:
        condition: service_healthy
    environment:
      - NODE_ENV=${NODE_ENV:-production}
      - DB_HOST=db
      - DB_PORT=5432
      - DB_USER=${DB_USER:-postgres}
      - DB_PASS=${DB_PASS:-postgres}
      - DB_NAME=${DB_NAME:-pokedex}
    restart: unless-stopped
    networks:
      - app-network
    volumes:
      - ./backend:/app

  # Database service
  db:
    image: postgres:15-alpine
    ports:
      - '5432:5432'
    environment:
      - POSTGRES_USER=${DB_USER:-postgres}
      - POSTGRES_PASSWORD=${DB_PASS:-postgres}
      - POSTGRES_DB=${DB_NAME:-pokedex}
    volumes:
      - db-data:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - app-network
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  app-network:
    driver: bridge

volumes:
  db-data:
    driver: local
EOF
echo "docker-compose.yml file created."

# Create the .env file
step "Creating .env file"
cat > .env << 'EOF'
# Database configuration
DB_USER=postgres
DB_PASS=postgres
DB_NAME=pokedex

# API URL for the frontend to connect to
API_URL=http://localhost:3000

# Node environment
NODE_ENV=development
EOF
echo ".env file created."

# Modify Django settings if needed
step "Checking Django settings"
echo "Note: You may need to update backend/backend/settings.py to use the environment variables."

# Start the docker containers
step "Starting Docker containers"
docker-compose up -d

# Check if the containers are running
step "Checking container status"
docker-compose ps

# Provide instructions for testing
step "Testing the application"
echo "To test if the application is working:"
echo "1. Frontend: Visit http://localhost:80 in your browser"
echo "2. Backend: Visit http://localhost:3000 in your browser"
echo "3. To check container logs, run: docker-compose logs"
echo "4. To stop the containers, run: docker-compose down"

echo ""
echo "Setup complete! Your Docker environment is now running."
echo "If you need to rebuild the containers, run: docker-compose up -d --build"