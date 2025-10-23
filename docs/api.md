# API Documentation

Docker Template Manager REST API for Unraid.

**Base URL:** `http://[YOUR-UNRAID-IP]:8889/api`

---

## 🔒 Authentication

**All endpoints require API key authentication** (except `/health`)

### Headers
```http
X-API-Key: your-api-key-here
```

### Query Parameter (Alternative)
```http
GET /api/stats?api_key=your-api-key-here
```

---

## Endpoints

### Health Check
```http
GET /api/health
```
**No authentication required**

**Response:**
```json
{
  "status": "healthy",
  "docker": "connected",
  "template_dir": true,
  "timestamp": "2025-10-19T12:00:00"
}
```

---

### Get Statistics
```http
GET /api/stats
```
**Requires: API Key**

**Response:**
```json
{
  "total_templates": 15,
  "total_containers": 20,
  "matched_templates": 12,
  "unmatched_templates": 3,
  "total_backups": 5,
  "running_containers": 18
}
```

---

### List Templates
```http
GET /api/templates
```
**Requires: API Key**

**Response:**
```json
[
  {
    "filename": "plex.xml",
    "name": "plex",
    "path": "/templates/plex.xml",
    "size": 2048,
    "modified": "2025-10-19T12:00:00",
    "matched": true,
    "container": {
      "id": "abc123",
      "name": "plex",
      "status": "running"
    }
  }
]
```

---

### Get Template
```http
GET /api/templates/{filename}
```
**Requires: API Key**

**Response:**
```json
{
  "filename": "plex.xml",
  "content": "<?xml version=\"1.0\"?>..."
}
```

---

### Delete Template
```http
DELETE /api/templates/{filename}
```
**Requires: API Key**

**Response:**
```json
{
  "success": true,
  "message": "Template plex.xml deleted"
}
```

---

### Cleanup Templates
```http
POST /api/templates/cleanup
Content-Type: application/json

{
  "dry_run": true
}
```
**Requires: API Key**

**Response (dry_run=true):**
```json
{
  "dry_run": true,
  "unused_templates": [...],
  "count": 3
}
```

**Response (dry_run=false):**
```json
{
  "success": true,
  "deleted": ["template1.xml", "template2.xml"],
  "count": 2
}
```

---

### List Containers
```http
GET /api/containers
```
**Requires: API Key**

**Response:**
```json
[
  {
    "id": "abc123",
    "name": "plex",
    "image": "plexinc/pms-docker:latest",
    "status": "running",
    "state": "running",
    "created": "2025-10-01T00:00:00",
    "has_template": true,
    "template": {...}
  }
]
```

---

### Get Container
```http
GET /api/containers/{container_name}
```
**Requires: API Key**

**Response:** Full Docker inspect data

---

### List Backups
```http
GET /api/backups
```
**Requires: API Key**

**Response:**
```json
[
  {
    "name": "backup-20251019-120000",
    "created": "2025-10-19T12:00:00",
    "container_count": 20,
    "template_count": 15,
    "size": 1048576,
    "path": "/backups/backup-20251019-120000"
  }
]
```

---

### Create Backup
```http
POST /api/backups
Content-Type: application/json

{
  "name": "my-backup"
}
```
**Requires: API Key**

**Response:**
```json
{
  "success": true,
  "backup_name": "my-backup",
  "message": "Backup created: my-backup"
}
```

---

### Delete Backup
```http
DELETE /api/backups/{backup_name}
```
**Requires: API Key**

**Response:**
```json
{
  "success": true,
  "message": "Backup my-backup deleted"
}
```

---

### Restore Backup
```http
POST /api/backups/{backup_name}/restore
```
**Requires: API Key**

**Response:**
```json
{
  "success": true,
  "message": "Restored 15 templates from backup my-backup",
  "restored_count": 15
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid filename"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized - Invalid or missing API key"
}
```

### 404 Not Found
```json
{
  "error": "Template not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to create backup"
}
```

---

## Example Usage

### cURL
```bash
# Get stats
curl -H "X-API-Key: your-key" http://192.168.1.100:8889/api/stats

# Create backup
curl -X POST -H "X-API-Key: your-key" \
  -H "Content-Type: application/json" \
  -d '{"name":"my-backup"}' \
  http://192.168.1.100:8889/api/backups
```

### JavaScript
```javascript
const API_KEY = 'your-key-here';
const BASE_URL = 'http://192.168.1.100:8889/api';

// Get stats
fetch(`${BASE_URL}/stats`, {
  headers: { 'X-API-Key': API_KEY }
})
  .then(res => res.json())
  .then(data => console.log(data));

// Create backup
fetch(`${BASE_URL}/backups`, {
  method: 'POST',
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'my-backup' })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### Python
```python
import requests

API_KEY = 'your-key-here'
BASE_URL = 'http://192.168.1.100:8889/api'
headers = {'X-API-Key': API_KEY}

# Get stats
response = requests.get(f'{BASE_URL}/stats', headers=headers)
print(response.json())

# Create backup
response = requests.post(
    f'{BASE_URL}/backups',
    headers=headers,
    json={'name': 'my-backup'}
)
print(response.json())
```

---

## Security Notes

- **Never commit API keys** to version control
- **Keep API key private** - it's like a password
- **Use HTTPS** in production with reverse proxy
- **Rotate keys** periodically for better security

---

For more info, see [SECURITY.md](../SECURITY.md)
