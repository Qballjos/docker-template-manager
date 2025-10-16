#!/bin/bash
set -e

# Set default values if not provided
export TEMPLATE_DIR="${TEMPLATE_DIR:-/templates}"
export BACKUP_DIR="${BACKUP_DIR:-/backups}"
export CONFIG_DIR="${CONFIG_DIR:-/config}"

echo "Docker Template Manager Starting..."
echo "Template Directory: $TEMPLATE_DIR"
echo "Backup Directory: $BACKUP_DIR"
echo "Config Directory: $CONFIG_DIR"

# Verify directories exist and create if necessary
mkdir -p "$TEMPLATE_DIR"
mkdir -p "$BACKUP_DIR"
mkdir -p "$CONFIG_DIR"

# Start Flask app
exec python app.py