#!/usr/bin/env python3
"""
Docker Template Manager - Backend API
Flask application for managing Unraid Docker templates
"""

from flask import send_from_directory
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import docker
import os
import json
import shutil
from datetime import datetime
from pathlib import Path
import re
import mimetypes
from functools import wraps
from werkzeug.security import safe_join
import secrets

# Configure MIME types for .jsx files
mimetypes.add_type('application/javascript', '.jsx')
mimetypes.add_type('application/javascript', '.js')

app = Flask(__name__)

# Security: Configure CORS properly - restrict to specific origins
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:8080,http://localhost:5173').split(',')
CORS(app, origins=ALLOWED_ORIGINS, supports_credentials=True)

# Security: API Key authentication
API_KEY = os.getenv('API_KEY', secrets.token_urlsafe(32))
if not os.getenv('API_KEY'):
    print(f"WARNING: No API_KEY set. Generated temporary key: {API_KEY}")
    print("Set API_KEY environment variable for production use!")

# Security: Configure security headers
@app.after_request
def set_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; connect-src 'self'"
    return response

# Security: Authentication decorator
def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check API key in header or query parameter
        key = request.headers.get('X-API-Key') or request.args.get('api_key')
        if not key or key != API_KEY:
            return jsonify({'error': 'Unauthorized - Invalid or missing API key'}), 401
        return f(*args, **kwargs)
    return decorated_function

# Security: Input validation helpers
def validate_filename(filename):
    """Validate filename to prevent path traversal"""
    if not filename:
        return False
    # Allow only alphanumeric, dots, hyphens, underscores
    if not re.match(r'^[a-zA-Z0-9._-]+$', filename):
        return False
    # Prevent directory traversal
    if '..' in filename or filename.startswith('/') or filename.startswith('\\'):
        return False
    # Must end with .xml for templates
    if not filename.endswith('.xml'):
        return False
    return True

def validate_backup_name(backup_name):
    """Validate backup name to prevent path traversal"""
    if not backup_name:
        return False
    # Allow only alphanumeric, hyphens
    if not re.match(r'^[a-zA-Z0-9-]+$', backup_name):
        return False
    if '..' in backup_name or '/' in backup_name or '\\' in backup_name:
        return False
    return True

def safe_path_join(base_dir, filename):
    """Safely join paths to prevent directory traversal"""
    try:
        # Use werkzeug's safe_join which prevents path traversal
        safe_path = safe_join(base_dir, filename)
        if safe_path is None or not safe_path.startswith(os.path.abspath(base_dir)):
            return None
        return safe_path
    except Exception:
        return None

# Configuration
TEMPLATE_DIR = os.getenv('TEMPLATE_DIR', '/templates')
BACKUP_DIR = os.getenv('BACKUP_DIR', '/backups')
CONFIG_DIR = os.getenv('CONFIG_DIR', '/config')

# Ensure directories exist
os.makedirs(BACKUP_DIR, exist_ok=True)
os.makedirs(CONFIG_DIR, exist_ok=True)

# Initialize Docker client
try:
    docker_client = docker.from_env()
except Exception as e:
    print(f"Warning: Could not connect to Docker: {e}")
    docker_client = None


class TemplateManager:
    """Manages Docker template operations"""
    
    @staticmethod
    def get_all_templates():
        """Get all template files"""
        templates = []
        if not os.path.exists(TEMPLATE_DIR):
            return templates
            
        for filename in os.listdir(TEMPLATE_DIR):
            if filename.endswith('.xml'):
                filepath = os.path.join(TEMPLATE_DIR, filename)
                template_name = filename[:-4]  # Remove .xml
                
                templates.append({
                    'filename': filename,
                    'name': template_name,
                    'path': filepath,
                    'size': os.path.getsize(filepath),
                    'modified': datetime.fromtimestamp(os.path.getmtime(filepath)).isoformat(),
                })
        
        return sorted(templates, key=lambda x: x['name'].lower())
    
    @staticmethod
    def find_matching_container(template_name, containers):
        """Find container matching template using multiple strategies"""
        # Strategy 1: Exact match
        for container in containers:
            if container['name'] == template_name:
                return container
        
        # Strategy 2: Remove common prefixes
        stripped_name = re.sub(r'^(my-|wp-)', '', template_name)
        for container in containers:
            if container['name'] == stripped_name:
                return container
        
        # Strategy 3: Case-insensitive match
        template_lower = template_name.lower()
        stripped_lower = stripped_name.lower()
        for container in containers:
            container_lower = container['name'].lower()
            if container_lower == template_lower or container_lower == stripped_lower:
                return container
        
        return None
    
    @staticmethod
    def get_template_content(filename):
        """Read template XML content with security validation"""
        # Security: Validate filename
        if not validate_filename(filename):
            return None
        
        filepath = safe_path_join(TEMPLATE_DIR, filename)
        if filepath is None:
            return None
            
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            # Security: Don't expose detailed error messages
            print(f"Error reading template {filename}: {e}")
            return None


class ContainerManager:
    """Manages Docker container operations"""
    
    @staticmethod
    def get_all_containers():
        """Get all containers (running and stopped)"""
        if not docker_client:
            return []
        
        containers = []
        try:
            for container in docker_client.containers.list(all=True):
                containers.append({
                    'id': container.id[:12],
                    'name': container.name,
                    'image': container.image.tags[0] if container.image.tags else container.image.id[:12],
                    'status': container.status,
                    'state': container.attrs['State']['Status'],
                    'created': container.attrs['Created'],
                })
        except Exception as e:
            print(f"Error getting containers: {e}")
        
        return sorted(containers, key=lambda x: x['name'].lower())
    
    @staticmethod
    def get_container_inspect(container_name):
        """Get detailed container information"""
        if not docker_client:
            return None
        
        try:
            container = docker_client.containers.get(container_name)
            return container.attrs
        except Exception as e:
            print(f"Error inspecting container {container_name}: {e}")
            return None


class BackupManager:
    """Manages backup operations"""
    
    @staticmethod
    def create_backup(backup_name=None):
        """Create backup of all containers and templates"""
        if backup_name is None:
            backup_name = f"backup-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
        
        backup_path = os.path.join(BACKUP_DIR, backup_name)
        os.makedirs(backup_path, exist_ok=True)
        
        # Backup templates
        templates_backup = os.path.join(backup_path, 'templates')
        if os.path.exists(TEMPLATE_DIR):
            shutil.copytree(TEMPLATE_DIR, templates_backup, dirs_exist_ok=True)
        
        # Backup container configurations
        containers_backup = os.path.join(backup_path, 'containers')
        os.makedirs(containers_backup, exist_ok=True)
        
        containers = ContainerManager.get_all_containers()
        for container in containers:
            inspect_data = ContainerManager.get_container_inspect(container['name'])
            if inspect_data:
                inspect_file = os.path.join(containers_backup, f"{container['name']}.json")
                with open(inspect_file, 'w') as f:
                    json.dump(inspect_data, f, indent=2)
        
        # Create mapping file
        mapping_file = os.path.join(backup_path, 'container-template-mapping.json')
        mapping = BackupManager._create_mapping(containers)
        with open(mapping_file, 'w') as f:
            json.dump(mapping, f, indent=2)
        
        # Create metadata
        metadata = {
            'created': datetime.now().isoformat(),
            'container_count': len(containers),
            'template_count': len(TemplateManager.get_all_templates()),
            'name': backup_name
        }
        metadata_file = os.path.join(backup_path, 'metadata.json')
        with open(metadata_file, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        return backup_name
    
    @staticmethod
    def _create_mapping(containers):
        """Create container to template mapping"""
        templates = TemplateManager.get_all_templates()
        mapping = []
        
        for container in containers:
            matched_template = TemplateManager.find_matching_container(
                container['name'], 
                [{'name': t['name']} for t in templates]
            )
            
            mapping.append({
                'container': container['name'],
                'template': matched_template['name'] if matched_template else None,
                'has_template': matched_template is not None
            })
        
        return mapping
    
    @staticmethod
    def list_backups():
        """List all available backups"""
        backups = []
        
        if not os.path.exists(BACKUP_DIR):
            return backups
        
        for backup_name in os.listdir(BACKUP_DIR):
            backup_path = os.path.join(BACKUP_DIR, backup_name)
            if os.path.isdir(backup_path):
                metadata_file = os.path.join(backup_path, 'metadata.json')
                
                if os.path.exists(metadata_file):
                    with open(metadata_file, 'r') as f:
                        metadata = json.load(f)
                else:
                    metadata = {
                        'created': datetime.fromtimestamp(os.path.getctime(backup_path)).isoformat(),
                        'name': backup_name
                    }
                
                # Calculate size
                total_size = sum(
                    os.path.getsize(os.path.join(dirpath, filename))
                    for dirpath, _, filenames in os.walk(backup_path)
                    for filename in filenames
                )
                
                metadata['size'] = total_size
                metadata['path'] = backup_path
                backups.append(metadata)
        
        return sorted(backups, key=lambda x: x['created'], reverse=True)


# API Routes

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint - no authentication required"""
    docker_status = 'connected' if docker_client else 'disconnected'
    template_dir_exists = os.path.exists(TEMPLATE_DIR)
    
    return jsonify({
        'status': 'healthy',
        'docker': docker_status,
        'template_dir': template_dir_exists,
        'timestamp': datetime.now().isoformat()
    })


@app.route('/api/stats', methods=['GET'])
@require_api_key
def get_stats():
    """Get dashboard statistics"""
    templates = TemplateManager.get_all_templates()
    containers = ContainerManager.get_all_containers()
    backups = BackupManager.list_backups()
    
    # Count matched and unmatched templates
    matched = 0
    unmatched = 0
    
    for template in templates:
        if TemplateManager.find_matching_container(template['name'], containers):
            matched += 1
        else:
            unmatched += 1
    
    return jsonify({
        'total_templates': len(templates),
        'total_containers': len(containers),
        'matched_templates': matched,
        'unmatched_templates': unmatched,
        'total_backups': len(backups),
        'running_containers': len([c for c in containers if c['status'] == 'running']),
    })


@app.route('/api/templates', methods=['GET'])
@require_api_key
def list_templates():
    """List all templates with matching status"""
    templates = TemplateManager.get_all_templates()
    containers = ContainerManager.get_all_containers()
    
    # Add matching information
    for template in templates:
        matched_container = TemplateManager.find_matching_container(
            template['name'], 
            containers
        )
        template['matched'] = matched_container is not None
        template['container'] = matched_container
    
    return jsonify(templates)


@app.route('/api/templates/<filename>', methods=['GET'])
@require_api_key
def get_template(filename):
    """Get specific template details"""
    # Security: Validate filename
    if not validate_filename(filename):
        return jsonify({'error': 'Invalid filename'}), 400
    
    content = TemplateManager.get_template_content(filename)
    if content is None:
        return jsonify({'error': 'Template not found'}), 404
    
    return jsonify({
        'filename': filename,
        'content': content
    })


@app.route('/api/templates/<filename>', methods=['DELETE'])
@require_api_key
def delete_template(filename):
    """Delete a template file"""
    # Security: Validate filename
    if not validate_filename(filename):
        return jsonify({'error': 'Invalid filename'}), 400
    
    filepath = safe_path_join(TEMPLATE_DIR, filename)
    if filepath is None or not os.path.exists(filepath):
        return jsonify({'error': 'Template not found'}), 404
    
    try:
        # Backup before delete
        backup_path = os.path.join(BACKUP_DIR, 'deleted-templates')
        os.makedirs(backup_path, exist_ok=True)
        
        timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
        backup_filename = f"{timestamp}-{filename}"
        backup_file = safe_path_join(backup_path, backup_filename)
        
        if backup_file is None:
            return jsonify({'error': 'Invalid backup path'}), 500
        
        shutil.copy2(filepath, backup_file)
        
        # Delete original
        os.remove(filepath)
        
        return jsonify({
            'success': True,
            'message': f'Template {filename} deleted'
        })
    except Exception as e:
        # Security: Don't expose detailed error messages
        print(f"Error deleting template: {e}")
        return jsonify({'error': 'Failed to delete template'}), 500


@app.route('/api/templates/<filename>/clone', methods=['POST'])
@require_api_key
def clone_template(filename):
    """Clone a template with a new name"""
    data = request.json or {}
    new_name = data.get('new_name', '').strip()
    
    # Security: Validate source filename
    if not validate_filename(filename):
        return jsonify({'error': 'Invalid source filename'}), 400
    
    # Security: Validate new filename
    if not new_name:
        return jsonify({'error': 'New name is required'}), 400
    
    # Ensure .xml extension
    if not new_name.endswith('.xml'):
        new_name += '.xml'
    
    if not validate_filename(new_name):
        return jsonify({'error': 'Invalid new filename. Use only letters, numbers, hyphens, underscores, and dots'}), 400
    
    # Get paths
    source_path = safe_path_join(TEMPLATE_DIR, filename)
    dest_path = safe_path_join(TEMPLATE_DIR, new_name)
    
    if source_path is None or dest_path is None:
        return jsonify({'error': 'Invalid file path'}), 400
    
    # Check source exists
    if not os.path.exists(source_path):
        return jsonify({'error': 'Source template not found'}), 404
    
    # Check destination doesn't exist
    if os.path.exists(dest_path):
        return jsonify({'error': f'Template {new_name} already exists'}), 409
    
    try:
        # Clone the file
        shutil.copy2(source_path, dest_path)
        
        return jsonify({
            'success': True,
            'filename': new_name,
            'message': f'Template cloned as {new_name}'
        })
    except Exception as e:
        # Security: Don't expose detailed error messages
        print(f"Error cloning template: {e}")
        return jsonify({'error': 'Failed to clone template'}), 500


@app.route('/api/templates/<filename>/edit', methods=['PUT'])
@require_api_key
def edit_template(filename):
    """Edit template content"""
    data = request.json or {}
    new_content = data.get('content', '').strip()
    
    # Security: Validate filename
    if not validate_filename(filename):
        return jsonify({'error': 'Invalid filename'}), 400
    
    if not new_content:
        return jsonify({'error': 'Content is required'}), 400
    
    # Get file path
    filepath = safe_path_join(TEMPLATE_DIR, filename)
    
    if filepath is None:
        return jsonify({'error': 'Invalid file path'}), 400
    
    if not os.path.exists(filepath):
        return jsonify({'error': 'Template not found'}), 404
    
    try:
        # Backup original before editing
        backup_path = os.path.join(BACKUP_DIR, 'edited-templates')
        os.makedirs(backup_path, exist_ok=True)
        
        timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
        backup_filename = f"{timestamp}-{filename}"
        backup_file = safe_path_join(backup_path, backup_filename)
        
        if backup_file:
            shutil.copy2(filepath, backup_file)
        
        # Write new content
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        return jsonify({
            'success': True,
            'message': f'Template {filename} updated successfully'
        })
    except Exception as e:
        # Security: Don't expose detailed error messages
        print(f"Error editing template: {e}")
        return jsonify({'error': 'Failed to edit template'}), 500


@app.route('/api/templates/<filename>/rename', methods=['PATCH'])
@require_api_key
def rename_template(filename):
    """Rename a template"""
    data = request.json or {}
    new_name = data.get('new_name', '').strip()
    
    # Security: Validate source filename
    if not validate_filename(filename):
        return jsonify({'error': 'Invalid source filename'}), 400
    
    # Security: Validate new filename
    if not new_name:
        return jsonify({'error': 'New name is required'}), 400
    
    # Ensure .xml extension
    if not new_name.endswith('.xml'):
        new_name += '.xml'
    
    if not validate_filename(new_name):
        return jsonify({'error': 'Invalid new filename. Use only letters, numbers, hyphens, underscores, and dots'}), 400
    
    # Get paths
    source_path = safe_path_join(TEMPLATE_DIR, filename)
    dest_path = safe_path_join(TEMPLATE_DIR, new_name)
    
    if source_path is None or dest_path is None:
        return jsonify({'error': 'Invalid file path'}), 400
    
    # Check source exists
    if not os.path.exists(source_path):
        return jsonify({'error': 'Source template not found'}), 404
    
    # Check destination doesn't exist
    if os.path.exists(dest_path):
        return jsonify({'error': f'Template {new_name} already exists'}), 409
    
    try:
        # Rename the file
        os.rename(source_path, dest_path)
        
        return jsonify({
            'success': True,
            'filename': new_name,
            'message': f'Template renamed to {new_name}'
        })
    except Exception as e:
        # Security: Don't expose detailed error messages
        print(f"Error renaming template: {e}")
        return jsonify({'error': 'Failed to rename template'}), 500


@app.route('/api/templates/cleanup', methods=['POST'])
@require_api_key
def cleanup_templates():
    """Clean up unused templates"""
    data = request.json or {}
    dry_run = data.get('dry_run', True)
    
    templates = TemplateManager.get_all_templates()
    containers = ContainerManager.get_all_containers()
    
    unused = []
    for template in templates:
        if not TemplateManager.find_matching_container(template['name'], containers):
            unused.append(template)
    
    if not dry_run:
        deleted = []
        for template in unused:
            try:
                filepath = os.path.join(TEMPLATE_DIR, template['filename'])
                
                # Backup before delete
                backup_path = os.path.join(BACKUP_DIR, 'auto-cleanup', 
                                         datetime.now().strftime('%Y%m%d-%H%M%S'))
                os.makedirs(backup_path, exist_ok=True)
                shutil.copy2(filepath, os.path.join(backup_path, template['filename']))
                
                # Delete
                os.remove(filepath)
                deleted.append(template['filename'])
            except Exception as e:
                print(f"Error deleting {template['filename']}: {e}")
        
        return jsonify({
            'success': True,
            'deleted': deleted,
            'count': len(deleted)
        })
    else:
        return jsonify({
            'dry_run': True,
            'unused_templates': unused,
            'count': len(unused)
        })


@app.route('/api/containers', methods=['GET'])
@require_api_key
def list_containers():
    """List all containers"""
    containers = ContainerManager.get_all_containers()
    templates = TemplateManager.get_all_templates()
    
    # Add template matching info
    for container in containers:
        matched_template = None
        for template in templates:
            if TemplateManager.find_matching_container(template['name'], [container]):
                matched_template = template
                break
        
        container['has_template'] = matched_template is not None
        container['template'] = matched_template
    
    return jsonify(containers)


@app.route('/api/containers/<container_name>', methods=['GET'])
@require_api_key
def get_container(container_name):
    """Get specific container details"""
    # Security: Validate container name
    if not re.match(r'^[a-zA-Z0-9_-]+$', container_name):
        return jsonify({'error': 'Invalid container name'}), 400
    
    inspect_data = ContainerManager.get_container_inspect(container_name)
    if inspect_data is None:
        return jsonify({'error': 'Container not found'}), 404
    
    return jsonify(inspect_data)


@app.route('/api/backups', methods=['GET'])
@require_api_key
def list_backups():
    """List all backups"""
    backups = BackupManager.list_backups()
    return jsonify(backups)


@app.route('/api/backups', methods=['POST'])
@require_api_key
def create_backup():
    """Create a new backup"""
    data = request.json or {}
    backup_name = data.get('name')
    
    # Security: Validate backup name if provided
    if backup_name and not validate_backup_name(backup_name):
        return jsonify({'error': 'Invalid backup name. Use only alphanumeric characters and hyphens'}), 400
    
    try:
        backup_name = BackupManager.create_backup(backup_name)
        return jsonify({
            'success': True,
            'backup_name': backup_name,
            'message': f'Backup created: {backup_name}'
        })
    except Exception as e:
        # Security: Don't expose detailed error messages
        print(f"Error creating backup: {e}")
        return jsonify({'error': 'Failed to create backup'}), 500


@app.route('/api/backups/<backup_name>', methods=['DELETE'])
@require_api_key
def delete_backup(backup_name):
    """Delete a backup"""
    # Security: Validate backup name
    if not validate_backup_name(backup_name):
        return jsonify({'error': 'Invalid backup name'}), 400
    
    backup_path = safe_path_join(BACKUP_DIR, backup_name)
    
    if backup_path is None or not os.path.exists(backup_path):
        return jsonify({'error': 'Backup not found'}), 404
    
    try:
        shutil.rmtree(backup_path)
        return jsonify({
            'success': True,
            'message': f'Backup {backup_name} deleted'
        })
    except Exception as e:
        # Security: Don't expose detailed error messages
        print(f"Error deleting backup: {e}")
        return jsonify({'error': 'Failed to delete backup'}), 500

@app.route('/api/backups/<backup_name>/restore', methods=['POST'])
@require_api_key
def restore_backup(backup_name):
    """Restore templates from a backup"""
    # Security: Validate backup name
    if not validate_backup_name(backup_name):
        return jsonify({'error': 'Invalid backup name'}), 400
    
    backup_path = safe_path_join(BACKUP_DIR, backup_name)
    if backup_path is None:
        return jsonify({'error': 'Invalid backup path'}), 400
        
    templates_backup_path = os.path.join(backup_path, 'templates')
    
    if not os.path.exists(backup_path):
        return jsonify({'error': 'Backup not found'}), 404
    
    if not os.path.exists(templates_backup_path):
        return jsonify({'error': 'Templates not found in backup'}), 404
    
    try:
        # Count templates to restore
        template_files = [f for f in os.listdir(templates_backup_path) 
                         if f.endswith('.xml') and validate_filename(f)]
        
        # Copy templates back to templates directory
        restored_count = 0
        for template_file in template_files:
            src = safe_path_join(templates_backup_path, template_file)
            dst = safe_path_join(TEMPLATE_DIR, template_file)
            
            if src and dst:
                shutil.copy2(src, dst)
                restored_count += 1
        
        return jsonify({
            'success': True,
            'message': f'Restored {restored_count} templates from backup {backup_name}',
            'restored_count': restored_count
        })
    except Exception as e:
        # Security: Don't expose detailed error messages
        print(f"Error restoring backup: {e}")
        return jsonify({'error': 'Failed to restore backup'}), 500

@app.route('/')
@app.route('/index.html')
def index():
    """Serve the React app index page"""
    return send_from_directory('static', 'index.html')

@app.route('/static/<path:filename>')
def serve_static(filename):
    """Serve static files (CSS, JS, etc)"""
    response = send_from_directory('static', filename)
    
    # Set correct MIME type for JavaScript files
    if filename.endswith('.jsx') or filename.endswith('.js'):
        response.headers['Content-Type'] = 'application/javascript; charset=utf-8'
    elif filename.endswith('.css'):
        response.headers['Content-Type'] = 'text/css; charset=utf-8'
    
    return response

@app.route('/favicon.ico')
def favicon():
    """Serve favicon or return 204 No Content"""
    return '', 204

if __name__ == '__main__':
    # Security: Disable debug mode in production
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    if debug_mode:
        print("WARNING: Running in DEBUG mode. Disable in production!")
    
    app.run(host='0.0.0.0', port=8080, debug=debug_mode)
    
