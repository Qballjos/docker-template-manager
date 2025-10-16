#!/bin/bash
set -e

echo "Docker Template Manager Starting..."
echo "Template Directory: $TEMPLATE_DIR"
echo "Backup Directory: $BACKUP_DIR"
echo "Config Directory: $CONFIG_DIR"

# Verify directories exist
mkdir -p $TEMPLATE_DIR
mkdir -p $BACKUP_DIR
mkdir -p $CONFIG_DIR

# Start Flask app
exec python app.py