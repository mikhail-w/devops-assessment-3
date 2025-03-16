#!/bin/bash
set -e

# Function to wait for PostgreSQL to be ready
wait_for_postgres() {
  echo "Waiting for PostgreSQL to be ready..."
  
  # Get database connection parameters from environment or use defaults
  DB_HOST=${DB_HOST:-db}
  DB_PORT=${DB_PORT:-5432}
  DB_USER=${DB_USER:-admin}
  DB_PASS=${DB_PASS:-adminpassword}
  DB_NAME=${DB_NAME:-pokedex_db}
  
  # Maximum number of attempts
  MAX_TRIES=60
  TRIES=0
  
  # Wait for PostgreSQL to become available
  until PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1" > /dev/null 2>&1; do
    TRIES=$((TRIES+1))
    if [ $TRIES -ge $MAX_TRIES ]; then
      echo "Error: PostgreSQL did not become available in time"
      exit 1
    fi
    echo "Waiting for PostgreSQL... ($TRIES/$MAX_TRIES)"
    sleep 1
  done
  
  echo "PostgreSQL is ready!"
}

# Wait for database to be ready
wait_for_postgres

echo "Running migrations..."
python manage.py migrate

echo "Creating superuser if it doesn't exist..."
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@mail.com', 'adminpassword') if not User.objects.filter(username='admin').exists() else None" | python manage.py shell

echo "Starting server..."
python manage.py runserver 0.0.0.0:3000