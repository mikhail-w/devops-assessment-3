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

# Create a script to set up the superuser
RUN echo '#!/bin/bash\n\
python manage.py migrate\n\
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser(\"admin\", \"admin@mail.com\", \"adminpassword\") if not User.objects.filter(username=\"admin\").exists() else None" | python manage.py shell\n\
python manage.py runserver 0.0.0.0:3000\n'\
> /app/entrypoint.sh && chmod +x /app/entrypoint.sh

# Run migrations, create superuser, and start server
COPY entrypoint.sh .
RUN chmod +x /app/entrypoint.sh
CMD ["/app/entrypoint.sh"]

EXPOSE 3000