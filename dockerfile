COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh
ENTRYPOINT ["/app/docker-entrypoint.sh"]

FROM python:3.11-slim

LABEL maintainer="your-email@example.com"
LABEL description="Docker Template Manager for Unraid"

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY app.py .
COPY static/ ./static/
COPY templates/ ./templates/

# Create directories for volumes
RUN mkdir -p /templates /backups /config

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8080/api/health')"

# Run application
CMD ["python", "app.py"]
