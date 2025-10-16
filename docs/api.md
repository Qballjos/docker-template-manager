# API Documentation

Docker Template Manager provides a comprehensive REST API for managing Docker templates on Unraid servers.

## Base URL

```
http://localhost:8080/api
```

Or when running on a remote Unraid server:

```
http://[SERVER-IP]:8080/api
```

## Authentication

Currently, there is no authentication required. All endpoints are publicly accessible. For future versions, consider adding API key or token-based authentication if needed.

## Response Format

All responses are returned as JSON. Successful requests return HTTP 200, while errors return appropriate HTTP status codes (400, 404, 500, etc.).

### Success Response

```json
{
  "status": "healthy",
  "data": {}
}
```

### Error Response

```json
{
  "error": "Error message describing what went wrong"
}
```

---

## Endpoints

### Health Check

#### GET /health

Check if the service is running and Docker is connected.

**Response:**
```json
{
  "status": "healthy",
  "docker": "connected",
  "template_dir": true,
  "timestamp": "2024-10-14T12:34:56.789012"
}
```

**Example:**
```bash
curl http://localhost:8080/api/health
```

---

### Statistics & Dashboard

#### GET /stats

Get dashboard statistics including template and container counts.

**Response:**
```json
{
  "total_templates": 124,
  "total_containers": 48,
  "matched_templates": 40,
  "unmatched_templates": 84,
  "total_backups": 3,
  "running_containers": 35
}
```

**Example:**
```bash
curl http://localhost:8080/api/stats
```

**Use Case:** Display on dashboard home page showing current system state.

---

## Template Endpoints

### List All Templates

#### GET /templates

Get all template files with their matching status.

**Query Parameters:**
- None

**Response:**
```json
[
  {
    "filename": "my-plex.xml",
    "name": "my-plex",
    "path": "/templates/my-plex.xml",
    "size": 8392,
    "modified": "2024-10-14T12:34:56.789012",
    "matched": true,
    "container": {
      "id": "abc123def456",
      "name": "plex",
      "image": "plexinc/pms-docker:latest",
      "status": "running",
      "state": "running"
    }
  },
  {
    "filename": "my-jellyfin.xml",
    "name": "my-jellyfin",
    "path": "/templates/my-jellyfin.xml",
    "size": 7156,
    "modified": "2024-10-14T10:22:33.654321",
    "matched": false,
    "container": null
  }
]
```

**Example:**
```bash
curl http://localhost:8080/api/templates
```

**Use Case:** Populate the templates list in the UI.

---

### Get Template Content

#### GET /templates/:filename

Get the full XML content of a specific template.

**Parameters:**
- `filename` (string, required): The template filename (e.g., "my-plex.xml")

**Response:**
```json
{
  "filename": "my-plex.xml",
  "content": "<?xml version='1.0'?>...[full XML content]..."
}
```

**Example:**
```bash
curl http://localhost:8080/api/templates/my-plex.xml
```

**Status Codes:**
- 200: Success
- 404: Template not found

---

### Delete Single Template

#### DELETE /templates/:filename

Delete a single template file. The template is automatically backed up before deletion.

**Parameters:**
- `filename` (string, required): The template filename to delete

**Response:**
```json
{
  "success": true,
  "message": "Template my-old-app.xml deleted",
  "backup": "/backups/deleted-templates/20241014-120345-my-old-app.xml"
}
```

**Example:**
```bash
curl -X DELETE http://localhost:8080/api/templates/my-old-app.xml
```

**Status Codes:**
- 200: Successfully deleted
- 404: Template not found
- 500: Server error during deletion

---

### Cleanup Unused Templates

#### POST /templates/cleanup

Find and optionally delete all unused templates (templates without matching containers).

**Request Body:**
```json
{
  "dry_run": true
}
```

**Parameters:**
- `dry_run` (boolean, optional, default: true): If true, returns list of unused templates without deleting them. If false, deletes all unused templates.

**Response (Dry Run):**
```json
{
  "dry_run": true,
  "unused_templates": [
    {
      "filename": "my-unused-app.xml",
      "name": "my-unused-app",
      "size": 5234,
      "modified": "2024-09-01T08:00:00.000000"
    }
  ],
  "count": 1
}
```

**Response (Actual Delete):**
```json
{
  "success": true,
  "deleted": [
    "my-unused-app.xml",
    "my-old-service.xml"
  ],
  "count": 2
}
```

**Examples:**

Preview cleanup:
```bash
curl -X POST http://localhost:8080/api/templates/cleanup \
  -H "Content-Type: application/json" \
  -d '{"dry_run": true}'
```

Execute cleanup:
```bash
curl -X POST http://localhost:8080/api/templates/cleanup \
  -H "Content-Type: application/json" \
  -d '{"dry_run": false}'
```

**Status Codes:**
- 200: Success
- 500: Server error

---

## Container Endpoints

### List All Containers

#### GET /containers

Get all Docker containers (running and stopped) with their template associations.

**Response:**
```json
[
  {
    "id": "abc123def456",
    "name": "plex",
    "image": "plexinc/pms-docker:latest",
    "status": "Up 5 days",
    "state": "running",
    "created": "2024-10-09T12:34:56.789012Z",
    "has_template": true,
    "template": {
      "filename": "my-plex.xml",
      "name": "my-plex",
      "size": 8392
    }
  },
  {
    "id": "xyz789abc123",
    "name": "docuseal-app-1",
    "image": "docuseal/docuseal:latest",
    "status": "Up 2 days",
    "state": "running",
    "created": "2024-10-12T08:22:33.654321Z",
    "has_template": false,
    "template": null
  }
]
```

**Example:**
```bash
curl http://localhost:8080/api/containers
```

**Use Case:** Display in containers tab, showing which containers have templates and which don't.

---

### Get Container Details

#### GET /containers/:container_name

Get detailed information about a specific container (full Docker inspect output).

**Parameters:**
- `container_name` (string, required): The container name (e.g., "plex")

**Response:**
```json
{
  "Id": "abc123def456...",
  "Created": "2024-10-09T12:34:56.789012Z",
  "State": {
    "Status": "running",
    "Running": true,
    "Paused": false,
    "Restarting": false,
    "OOMKilled": false,
    "Dead": false
  },
  "Config": {
    "Hostname": "plex",
    "Image": "plexinc/pms-docker:latest",
    "Env": [...],
    "Labels": {...}
  },
  "Mounts": [...],
  "NetworkSettings": {...}
}
```

**Example:**
```bash
curl http://localhost:8080/api/containers/plex
```

**Status Codes:**
- 200: Success
- 404: Container not found

---

## Backup Endpoints

### List All Backups

#### GET /backups

Get list of all available backups with metadata.

**Response:**
```json
[
  {
    "created": "2024-10-14T12:34:56.789012",
    "name": "backup-20241014-123456",
    "size": 2048576,
    "container_count": 48,
    "template_count": 124,
    "path": "/backups/backup-20241014-123456"
  },
  {
    "created": "2024-10-13T08:22:33.654321",
    "name": "backup-20241013-082233",
    "size": 1998765,
    "container_count": 47,
    "template_count": 123,
    "path": "/backups/backup-20241013-082233"
  }
]
```

**Example:**
```bash
curl http://localhost:8080/api/backups
```

**Use Case:** Display backup list in UI, showing backup dates, sizes, and contents.

---

### Create Backup

#### POST /backups

Create a new backup of all containers and templates.

**Request Body:**
```json
{
  "name": "my-backup"
}
```

**Parameters:**
- `name` (string, optional): Custom backup name. If omitted, auto-generates timestamp-based name.

**Response:**
```json
{
  "success": true,
  "backup_name": "backup-20241014-123456",
  "message": "Backup created: backup-20241014-123456"
}
```

**Examples:**

Auto-named backup:
```bash
curl -X POST http://localhost:8080/api/backups \
  -H "Content-Type: application/json" \
  -d '{}'
```

Custom named backup:
```bash
curl -X POST http://localhost:8080/api/backups \
  -H "Content-Type: application/json" \
  -d '{"name": "pre-migration-backup"}'
```

**Status Codes:**
- 200: Backup created successfully
- 500: Server error during backup

**What's Included:**
- All template files (copied from templates directory)
- All container configurations (docker inspect output as JSON)
- Container-to-template mapping file
- Backup metadata (timestamps, counts, etc.)

---

### Delete Backup

#### DELETE /backups/:backup_name

Delete a specific backup by name.

**Parameters:**
- `backup_name` (string, required): The backup directory name (e.g., "backup-20241014-123456")

**Response:**
```json
{
  "success": true,
  "message": "Backup backup-20241014-123456 deleted"
}
```

**Example:**
```bash
curl -X DELETE http://localhost:8080/api/backups/backup-20241014-123456
```

**Status Codes:**
- 200: Successfully deleted
- 404: Backup not found
- 500: Server error during deletion

---

## Usage Examples

### Workflow: Clean Up Before Migration

```bash
# 1. Check current stats
curl http://localhost:8080/api/stats

# 2. Preview unused templates
curl -X POST http://localhost:8080/api/templates/cleanup \
  -H "Content-Type: application/json" \
  -d '{"dry_run": true}'

# 3. Create backup before cleanup
curl -X POST http://localhost:8080/api/backups \
  -H "Content-Type: application/json" \
  -d '{"name": "pre-cleanup-backup"}'

# 4. Execute cleanup
curl -X POST http://localhost:8080/api/templates/cleanup \
  -H "Content-Type: application/json" \
  -d '{"dry_run": false}'

# 5. Verify results
curl http://localhost:8080/api/stats
```

### Workflow: Migration Preparation

```bash
# 1. List containers to identify dependencies
curl http://localhost:8080/api/containers | jq '.[].name'

# 2. Create pre-migration backup
curl -X POST http://localhost:8080/api/backups \
  -H "Content-Type: application/json" \
  -d '{"name": "pre-vdisk-to-folder-migration"}'

# 3. List backups to confirm
curl http://localhost:8080/api/backups
```

---

## Error Handling

### Common HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | Success | Template retrieved successfully |
| 400 | Bad Request | Invalid JSON in request body |
| 404 | Not Found | Template or container doesn't exist |
| 500 | Server Error | Docker connection failed, file permission error |

### Error Response Format

All errors return a JSON object with an error message:

```json
{
  "error": "Template not found"
}
```

---

## Rate Limiting

Currently, there is no rate limiting. All endpoints can be called as frequently as needed.

---

## Pagination

Currently, there is no pagination. All results are returned in full. For large template or container lists, consider implementing pagination in future versions.

---

## Versioning

Current API version: **1.0**

All endpoints are currently under `/api/`. Future versions may be namespaced (e.g., `/api/v2/`).

---

## Best Practices

1. **Always use dry-run first**: Before executing cleanup operations, use `dry_run: true` to preview changes.

2. **Create backups regularly**: Use the backup endpoint before major operations.

3. **Monitor Docker connection**: Check `/api/health` to ensure Docker socket is properly connected.

4. **Handle errors gracefully**: Implement error handling for all API calls in your integrations.

5. **Use appropriate timeouts**: For backup operations on systems with many containers, allow adequate timeout (30+ seconds).

---

## Future Enhancements

Planned features for future API versions:

- Backup restoration endpoint
- Template restoration from backup
- Scheduled backups
- Template export/import
- Bulk operations with progress tracking
- API authentication/authorization
- Rate limiting
- Pagination for large result sets
- WebSocket support for real-time updates