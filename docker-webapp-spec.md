# Docker Template Manager - Web Application

## Container Approach

A standalone Docker container with a web interface that manages Docker templates on the Unraid host.

## Tech Stack

**Backend:**
- Python Flask or Node.js Express
- Direct Docker socket access
- File system access to template directory

**Frontend:**
- React or Vue.js
- Modern UI framework (Tailwind CSS)
- Real-time updates via WebSockets

## Docker Compose Setup

```yaml
version: '3.8'

services:
  docker-template-manager:
    image: yourusername/docker-template-manager:latest
    container_name: docker-template-manager
    ports:
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro  # Docker access
      - /boot/config/plugins/dockerMan/templates-user:/templates:rw  # Templates
      - /mnt/user/appdata/docker-template-manager:/backups:rw  # Backups
      - /mnt/user/appdata/docker-template-manager/config:/config:rw  # Settings
    environment:
      - TZ=Europe/Amsterdam
      - BACKUP_RETENTION_DAYS=30
      - AUTO_CLEANUP_ENABLED=false
    restart: unless-stopped
```

## Unraid Template XML

```xml
<?xml version="1.0"?>
<Container version="2">
  <Name>DockerTemplateManager</Name>
  <Repository>yourusername/docker-template-manager</Repository>
  <Registry>https://hub.docker.com/r/yourusername/docker-template-manager/</Registry>
  <Network>bridge</Network>
  <Shell>bash</Shell>
  <Privileged>false</Privileged>
  <Support>https://github.com/yourusername/docker-template-manager</Support>
  <Project>https://github.com/yourusername/docker-template-manager</Project>
  <Overview>
    Manage Docker templates on Unraid. Clean up unused templates, backup containers, and migrate from vdisk to folder-based Docker configuration.
  </Overview>
  <Category>Tools:Utilities</Category>
  <WebUI>http://[IP]:[PORT:8080]</WebUI>
  <TemplateURL>https://raw.githubusercontent.com/yourusername/docker-template-manager/master/unraid-template.xml</TemplateURL>
  <Icon>https://raw.githubusercontent.com/yourusername/docker-template-manager/master/logo.png</Icon>
  
  <Config Name="WebUI Port" Target="8080" Default="8080" Mode="tcp" Description="Web interface port" Type="Port" Display="always" Required="true" Mask="false">8080</Config>
  
  <Config Name="Docker Socket" Target="/var/run/docker.sock" Default="/var/run/docker.sock" Mode="ro" Description="Docker socket for container management" Type="Path" Display="always" Required="true" Mask="false">/var/run/docker.sock</Config>
  
  <Config Name="Templates Directory" Target="/templates" Default="/boot/config/plugins/dockerMan/templates-user" Mode="rw" Description="Unraid Docker templates directory" Type="Path" Display="always" Required="true" Mask="false">/boot/config/plugins/dockerMan/templates-user</Config>
  
  <Config Name="Backups Directory" Target="/backups" Default="/mnt/user/appdata/docker-template-manager" Mode="rw" Description="Backup storage location" Type="Path" Display="always" Required="true" Mask="false">/mnt/user/appdata/docker-template-manager</Config>
  
  <Config Name="Config Directory" Target="/config" Default="/mnt/user/appdata/docker-template-manager/config" Mode="rw" Description="Application configuration" Type="Path" Display="always" Required="true" Mask="false">/mnt/user/appdata/docker-template-manager/config</Config>
  
  <Config Name="Backup Retention" Target="BACKUP_RETENTION_DAYS" Default="30" Mode="" Description="Days to keep backups" Type="Variable" Display="always" Required="false" Mask="false">30</Config>
  
  <Config Name="Auto Cleanup" Target="AUTO_CLEANUP_ENABLED" Default="false" Mode="" Description="Enable automatic template cleanup" Type="Variable" Display="always" Required="false" Mask="false">false</Config>
</Container>
```

## Application Structure

```
docker-template-manager/
├── backend/
│   ├── app.py (or server.js)
│   ├── api/
│   │   ├── templates.py
│   │   ├── containers.py
│   │   ├── backups.py
│   │   └── settings.py
│   ├── services/
│   │   ├── docker_service.py
│   │   ├── template_matcher.py
│   │   └── backup_service.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TemplateList.jsx
│   │   │   ├── BackupManager.jsx
│   │   │   └── Settings.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Key Features

### 1. Dashboard
- Real-time container status
- Template usage statistics
- Quick actions
- Recent activity log
- Backup status overview

### 2. Template Management
- **Visual List**: All templates with status indicators
- **Smart Matching**: Shows container relationships
- **Bulk Operations**: Select and manage multiple templates
- **Preview Mode**: See what will be deleted before confirming
- **Undo Support**: Restore recently deleted templates
- **Template Editor**: View and edit template XML

### 3. Container Backup
- **One-Click Backup**: Backup all containers instantly
- **Scheduled Backups**: Automatic backup scheduling
- **Incremental Backups**: Only backup changed configurations
- **Backup Browser**: Browse and restore from backups
- **Export/Import**: Download backups or import from files
- **Compression**: Automatic backup compression

### 4. Migration Assistant
- **Step-by-Step Wizard**: Guide through vdisk → folder migration
- **Pre-Migration Check**: Verify system readiness
- **Progress Tracking**: Real-time migration status
- **Rollback Support**: Undo migration if needed
- **Post-Migration Verification**: Ensure everything works

### 5. Advanced Features
- **Template Validation**: Check templates for errors
- **Dependency Detection**: Identify container dependencies
- **Update Notifications**: Alert for outdated images
- **Search & Filter**: Find templates/containers quickly
- **Dark Mode**: Easy on the eyes
- **API Access**: RESTful API for automation
- **Webhooks**: Trigger actions on events
- **Multi-User Support**: Basic authentication

## API Endpoints

```
GET    /api/templates              - List all templates
GET    /api/templates/:id          - Get template details
DELETE /api/templates/:id          - Delete template
POST   /api/templates/cleanup      - Clean up unused templates
POST   /api/templates/scan         - Scan for matches

GET    /api/containers             - List all containers
GET    /api/containers/:id         - Get container details
POST   /api/containers/backup      - Backup containers
POST   /api/containers/restore     - Restore from backup

GET    /api/backups                - List all backups
GET    /api/backups/:id            - Get backup details
POST   /api/backups/:id/restore    - Restore specific backup
DELETE /api/backups/:id            - Delete backup

GET    /api/settings               - Get settings
PUT    /api/settings               - Update settings
GET    /api/health                 - Health check
GET    /api/stats                  - Statistics
```

## Security Considerations

1. **Read-Only Docker Socket**: Minimize container permissions
2. **Authentication**: Optional password protection
3. **HTTPS Support**: Built-in SSL/TLS
4. **Audit Logging**: Track all actions
5. **Backup Encryption**: Optional backup encryption
6. **Rate Limiting**: Prevent abuse
7. **CORS Configuration**: Secure API access

## Advantages of Container Approach

✅ **Easy Installation**: Just install from Community Apps
✅ **No System Changes**: Doesn't modify Unraid system
✅ **Portable**: Works on any Docker host
✅ **Modern UI**: Rich, responsive web interface
✅ **Auto-Updates**: Docker image updates
✅ **Isolated**: Runs in its own container
✅ **Cross-Platform**: Could work on other Docker hosts
✅ **Development-Friendly**: Easier to develop and test

## Development Roadmap

### Phase 1: MVP (2-3 weeks)
- Basic template listing
- Container matching
- Simple cleanup functionality
- Basic backup/restore

### Phase 2: Enhanced Features (2-3 weeks)
- Migration wizard
- Advanced filtering
- Scheduling
- Better UI/UX

### Phase 3: Advanced (2-3 weeks)
- API access
- Webhooks
- Multi-user support
- Advanced analytics

### Phase 4: Polish (1-2 weeks)
- Documentation
- Tutorial videos
- Community Applications submission
- Bug fixes

## Deployment Options

1. **GitHub Repository**: Open source project
2. **Docker Hub**: Automated builds
3. **Community Applications**: Easy installation
4. **Documentation Site**: GitHub Pages
5. **Support Forum**: GitHub Discussions

## Would you like me to:

1. **Start building the Unraid Plugin** (native integration)
2. **Create the Docker Container Web App** (easier to develop, more portable)
3. **Create both** (plugin calls the container)
4. **Just keep the bash scripts** (simplest, what we have now)

I'd personally recommend **Option 2 (Docker Container)** because:
- Faster to develop and test
- Easier to maintain
- Works on any Docker system (not just Unraid)
- Modern web UI is more user-friendly
- Can be installed from Community Applications
- No risk of breaking Unraid system
