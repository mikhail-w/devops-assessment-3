# =============== Build stage =============== 
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
# Runs npm ci instead of npm install
# Ensures reproducible builds (installs exact versions from package-lock.json)
# Faster than npm install in CI/CD environments
RUN npm ci

# Copy application files
# Copies the entire frontend source code into /app inside the container
COPY . ./

# Add environment variable support
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

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