# Dev-Ops Assessment III

This Pokédex application demonstrates a comprehensive implementation of
Continuous Integration and Continuous Deployment (CI/CD) principles utilizing
containerization and automation through GitHub Actions. The project successfully
automates the deployment of a three-tier application stack through a
well-structured CI/CD pipeline. The stack includes a React frontend with Nginx
web server, a Django backend API, and a PostgreSQL database, all containerized
using Docker and orchestrated with Docker Compose. The pipeline manages secrets
and environment variables across multiple environments, builds and deploys
containerized instances of each application component, and automates the
delivery process using GitHub Actions workflows, resulting in a deployment that
requires minimal manual intervention.

<p align="center"style="margin-top: 30px;">
  <img src="./frontend/src/assets/images/pokemon/pokedex.png" alt="Pokedex Logo">
</p>

## 🌐 Live Demo

Visit the live application at: [here](https://d18sty0dsu44el.cloudfront.net/).

## 🌟 Features

- **Pokémon Browser**: Search and view detailed information about Pokémon using
  data from the PokeAPI
- **User Authentication**: Create accounts and login to maintain personalized
  profiles
- **Team Building**: Create and manage your own Pokémon teams
- **Memory Game**: Test your memory with a Pokémon memory matching game
- **Leaderboards**: Compete for high scores in different difficulty levels

## 🏗️ Architecture

This application follows a three-tier architecture:

- **Frontend**: React.js application served by Nginx
- **Backend**: Django REST API with JWT authentication
- **Database**: PostgreSQL for data persistence

All components are containerized using Docker and orchestrated with Docker
Compose.

### System Architecture Diagram

<p align="center"style="margin-top: 30px;">
  <img src="./frontend/src/assets/images/pokedex-architecture-diagram.png" alt="Pokedex Logo">
</p>

## 🚀 CI/CD Pipeline

The project implements a complete CI/CD pipeline using GitHub Actions:

1. **Test**: Automatically runs frontend and backend tests
2. **Build**: Builds Docker images for both frontend and backend
3. **Deploy**: Provisions AWS infrastructure using Terraform and deploys the
   application
4. **Health Check**: Verifies that the application is running correctly

### CI/CD Pipeline Workflow

<p align="center"style="margin-top: 30px;">
  <img src="./frontend/src/assets/images/POKEDEX-CICD.png" alt="Pokedex Logo">
</p>

## 📊 Technical Stack

### Frontend

- React.js
- Axios for API requests
- CSS for styling
- Served via Nginx

### Backend

- Django 5.1.6
- Django REST Framework 3.15.2
- JWT Authentication via SimpleJWT
- PostgreSQL database

### DevOps

- Docker & Docker Compose
- GitHub Actions
- Terraform for infrastructure as code
- AWS EC2 for hosting

## 🛠️ Local Development Setup

### Prerequisites

- Git
- Docker and Docker Compose
- Node.js (optional, for local frontend development)
- Python 3.11 (optional, for local backend development)

### Getting Started

1. Clone the repository:

   ```bash
   https://github.com/mikhail-w/devops-assessment-3.git
   cd devops-assessment-3
   ```

2. Create a `.env` file in the root directory:

   ```
   # Database Configuration
   DB_USER=admin
   DB_PASS=adminpassword
   DB_NAME=pokedex_db
   DB_HOST=db
   DB_PORT=5432

   # Django Configuration
   DJANGO_SECRET_KEY=your-secret-key
   DEBUG=True

   # Server Configuration
   SERVER_IP=localhost
   ```

3. Start the application:

   ```bash
   docker-compose up -d
   ```

4. Create a superuser for the Django admin:

   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

5. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:3000
   - Admin Interface: http://localhost:3000/admin

## 📦 Production Deployment

The application is set up for automatic deployment to AWS EC2 using GitHub
Actions. To deploy:

### GitHub Repository Secrets

To enable secure CI/CD pipeline deployment, the following secrets must be
configured in your GitHub repository:

1. **AWS Configuration**:

   - `AWS_ACCESS_KEY_ID`: Your AWS access key for programmatic access
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
   - `AWS_REGION`: AWS region to deploy (e.g., `us-east-1`)

2. **Docker Hub Credentials**:

   - `DOCKER_HUB_USERNAME`: Your Docker Hub username
   - `DOCKER_HUB_TOKEN`: Access token for Docker Hub (not your password)

3. **SSH Keys**:

   - `SSH_PRIVATE_KEY`: Private SSH key for accessing the EC2 instance

4. **Application Secrets**:
   - `DJANGO_SECRET_KEY`: Secret key for Django application
   - `DB_USER`: Database username
   - `DB_PASS`: Database password
   - `DB_NAME`: Database name

These secrets are securely stored by GitHub and injected into the workflow
environment during pipeline execution without being exposed in logs.

### Terraform Configuration

The infrastructure is defined as code using Terraform in the `main.tf` file:

```hcl
provider "aws" {
  region = var.aws_region
}

# EC2 Instance
resource "aws_instance" "app_server" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  key_name               = aws_key_pair.deployer.key_name
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  root_block_device {
    volume_size = 20
    volume_type = "gp2"
  }

  user_data = <<-EOF
    #!/bin/bash
    # Install Docker and other dependencies
    apt-get update
    apt-get install -y docker.io docker-compose
    systemctl enable docker
    systemctl start docker
    usermod -aG docker ubuntu
  EOF

  tags = {
    Name = "${var.app_name}-server"
  }
}

# Security Group
resource "aws_security_group" "app_sg" {
  name        = "${var.app_name}-sg"
  description = "Allow traffic for Pokédex application"

  # SSH access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP access
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Backend API port
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Elastic IP for stable access
resource "aws_eip" "app_eip" {
  instance = aws_instance.app_server.id
  domain   = "vpc"
}
```

### Docker Configuration

The application is containerized using Docker with separate containers for
frontend, backend, and database:

#### Frontend Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Backend Dockerfile

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
COPY entrypoint.sh .
RUN chmod +x /app/entrypoint.sh
CMD ["/app/entrypoint.sh"]
EXPOSE 3000
```

#### Docker Compose Configuration

```yaml
version: '3.8'

services:
  frontend:
    image: ${DOCKER_HUB_USERNAME}/pokedex-frontend:latest
    ports:
      - '80:80'
    depends_on:
      - backend
    environment:
      - VITE_API_BASE_URL=http://${SERVER_IP:-localhost}:3000
    restart: unless-stopped
    networks:
      - app-network

  backend:
    image: ${DOCKER_HUB_USERNAME}/pokedex-backend:latest
    ports:
      - '3000:3000'
    depends_on:
      db:
        condition: service_healthy
    environment:
      - DEBUG=True
      - SECRET_KEY=${DJANGO_SECRET_KEY:-default_dev_key}
      - DB_HOST=db
      - DB_PORT=5432
      - DB_USER=${DB_USER:-admin}
      - DB_PASS=${DB_PASS:-adminpassword}
      - DB_NAME=${DB_NAME:-pokedex_db}
      - SERVER_IP=${SERVER_IP:-localhost}
    restart: unless-stopped
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=${DB_USER:-admin}
      - POSTGRES_PASSWORD=${DB_PASS:-adminpassword}
      - POSTGRES_DB=${DB_NAME:-pokedex_db}
    restart: unless-stopped
    networks:
      - app-network
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${DB_USER}']
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

networks:
  app-network:
    driver: bridge

volumes:
  db-data:
    driver: local
```

To trigger the CI/CD pipeline:

1. Push to the main branch:

   ```bash
   git push origin main
   ```

2. The GitHub Actions workflow will:
   - Run tests
   - Build and push Docker images
   - Provision AWS infrastructure
   - Deploy the application
   - Verify deployment with health checks

## 📁 Project Structure

```
pokedex-app/
├── .github/
│   └── workflows/
│       └── cicd.yml       # CI/CD pipeline configuration
├── frontend/
│   ├── public/            # Static assets
│   ├── src/               # React components and logic
│   │   ├── services/      # API service clients
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   └── pages/         # Application pages
│   ├── Dockerfile         # Frontend container configuration
│   └── nginx.conf         # Nginx web server configuration
├── backend/
│   ├── users/             # Django app for user management
│   ├── backend/           # Django project settings
│   ├── manage.py          # Django management script
│   ├── requirements.txt   # Python dependencies
│   └── Dockerfile         # Backend container configuration
├── docker-compose.yml     # Container orchestration
├── main.tf                # Terraform configuration for AWS
├── entrypoint.sh          # Docker entrypoint script
└── README.md              # This file
```

## 🧪 Testing

### Running Tests Locally

Frontend tests:

```bash
cd frontend
npm test
```

Backend tests:

```bash
cd backend
python manage.py test
```

## 🔧 CI/CD Pipeline In-Depth Documentation

### Project Overview

This Pokédex application is a three-tier web application that allows users to
browse Pokémon, create accounts, build teams, and play memory games. The
application is containerized using Docker and deployed using a CI/CD pipeline
with GitHub Actions and AWS.

### System Architecture

The application consists of three main components:

1. **Frontend**: React application served via Nginx
2. **Backend**: Django REST API
3. **Database**: PostgreSQL

### Technical Stack

#### Frontend

- React.js
- Nginx (for serving static content and proxying API requests)
- Containerized in Docker

#### Backend

- Django 5.1.6
- Django REST Framework 3.15.2
- JWT Authentication
- Containerized in Docker

#### Database

- PostgreSQL

#### DevOps

- Docker & Docker Compose for containerization
- GitHub Actions for CI/CD
- Terraform for infrastructure as code
- AWS EC2 for hosting

### Deployment Architecture

The application is deployed on AWS with the following architecture:

1. **AWS EC2 Instance**: t2.micro running Ubuntu 22.04
2. **Docker Containers**:
   - Frontend container (Nginx serving React)
   - Backend container (Django)
   - Database container (PostgreSQL)
3. **Networking**:
   - Frontend exposed on port 80
   - Backend exposed on port 3000
   - Database accessible only within the Docker network

### CI/CD Pipeline

The CI/CD pipeline is implemented using GitHub Actions and consists of the
following stages:

1. **Test**: Run tests for both frontend and backend
2. **Build**: Build Docker images for frontend and backend
3. **Deploy**: Provision AWS infrastructure with Terraform and deploy the
   application
4. **Health Check**: Verify the application is running correctly

#### Pipeline Workflow

```
Test → Build → Deploy → Health Check
```

### Infrastructure Configuration

#### Terraform Configuration

The infrastructure is defined in the `main.tf` file, which provisions:

1. An EC2 instance on AWS
2. A security group with necessary ports open
3. An Elastic IP for a static public IP address
4. SSH key pair for secure access

#### Docker Configuration

The application uses three Docker containers orchestrated with Docker Compose:

1. Frontend container:

   - Built from `frontend/Dockerfile`
   - Nginx configuration in `frontend/nginx.conf`

2. Backend container:

   - Built from `backend/Dockerfile`
   - Django application with REST API

3. Database container:
   - Uses the official PostgreSQL image
   - Data persisted using a Docker volume

### API Endpoints

#### Authentication

- `POST /api/users/register/`: Register a new user
- `POST /api/users/login/`: Login and receive JWT tokens
- `POST /api/users/logout/`: Logout and invalidate tokens

#### User Data

- `GET /api/users/team/`: Get the current user's Pokémon team
- `POST /api/users/update_team/`: Add or remove Pokémon from team
- `POST /api/users/update_high_score/`: Update game high scores
- `GET /api/users/leaderboard/`: Get leaderboard data

#### Pokémon Data

- External API calls to PokeAPI for Pokémon information
