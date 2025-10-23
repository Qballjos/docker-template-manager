# Use specific version for security
FROM python:3.14.0-slim-bookworm

# Security: Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Security: Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Security: Update packages and install security updates
# Pin package versions for reproducible builds and security
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
        curl=7.88.1-10+deb12u14 \
        ca-certificates=20230311+deb12u1 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Security: Copy requirements first for better caching
COPY requirements.txt .

# Security: Install dependencies with security flags
RUN pip install --no-cache-dir --upgrade pip==24.3.1 && \
    pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY app.py .
COPY static/ ./static/
COPY docker-entrypoint.sh /app/

# Security: Set proper permissions
RUN chmod +x /app/docker-entrypoint.sh && \
    chmod 755 /app/app.py && \
    mkdir -p /templates /backups /config && \
    chown -R appuser:appuser /app /templates /backups /config

# Security: Switch to non-root user
USER appuser

# Expose port
EXPOSE 8889

# Health check with security considerations
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8889/api/health', timeout=5)"

# Security: Run as non-root user
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["python", "app.py"]