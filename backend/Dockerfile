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

# Create an improved entrypoint script
COPY entrypoint.sh .
RUN chmod +x /app/entrypoint.sh

# Run migrations, create superuser, and start server
CMD ["/app/entrypoint.sh"]

EXPOSE 3000