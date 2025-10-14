# 🐳 Docker Template Manager for Unraid

A modern web application for managing Docker templates on Unraid servers. Clean up unused templates, create backups, and prepare for vdisk-to-folder Docker migration with ease.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)
![Unraid](https://img.shields.io/badge/unraid-compatible-orange.svg)

## 🌟 Features

- **📊 Dashboard Overview**: See all your templates, containers, and backups at a glance
- **🔍 Smart Template Matching**: Automatically matches templates to containers (handles `my-`, `wp-` prefixes)
- **🧹 Clean Up Unused Templates**: Safely remove templates that don't have matching containers
- **💾 One-Click Backups**: Backup all containers and templates with a single click
- **📦 Container Management**: View all containers and their template relationships
- **🎨 Modern Web UI**: Beautiful, responsive interface that works on desktop and mobile
- **🔒 Safe Operations**: Automatic backups before any deletions
- **📝 Detailed Logging**: Track all operations with container-template mappings

## 📸 Screenshots

### Dashboard
![Dashboard](docs/dashboard.png)

### Template Management
![Templates](docs/templates.png)

### Backup Manager
![Backups](docs/backups.png)

## 🚀 Quick Start

### Option 1: Install from Unraid Community Applications (Recommended)

1. Open Unraid web interface
2. Go to **Apps** tab
3. Search for "Docker Template Manager"
4. Click **Install**
5. Access at `http://[YOUR-SERVER-IP]:8080`

### Option 2: Manual Installation via Template URL

1. Go to **Docker** tab in Unraid
2. Click **Add Container**
3. Set **Template repositories** to:
   ```
   https://raw.githubusercontent.com/yourusername/docker-template-manager/master/unraid-template.xml
   ```
4. Select "Docker Template Manager" from the dropdown
5. Click **Apply**

### Option 3: Docker Compose (Advanced)

```bash
cd /mnt/user/appdata/docker-template-manager
wget https://raw.githubusercontent.com/yourusername/docker-template-manager/master/docker-compose.yml
docker-compose up -d
```

## 📋 Configuration

### Default Paths

| Volume | Host Path | Container Path | Description |
|--------|-----------|----------------|-------------|
| Templates | `/boot/config/plugins/dockerMan/templates-user` | `/templates` | Unraid template directory |
| Backups | `/mnt/user/appdata/docker-template-manager/backups` | `/backups` | Backup storage |
| Config | `/mnt/user/appdata/docker-template-manager/config` | `/config` | App configuration |
| Docker Socket | `/var/run/docker.sock` | `/var/run/docker.sock` | Docker access (read-only) |

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `TZ` | `Europe/Amsterdam` | Timezone for timestamps |
| `BACKUP_RETENTION_DAYS` | `30` | Days to keep old backups |
| `AUTO_CLEANUP_ENABLED` | `false` | Enable automatic cleanup |

## 🎯 Use Cases

### 1. Template Cleanup

**Problem**: You have 124 templates but only 48 containers running.

**Solution**:
1. Open Docker Template Manager
2. Go to **Templates** tab
3. See which templates are unused (marked with ✗)
4. Click "Clean Up Unused" to remove them all at once
5. Templates are automatically backed up before deletion

### 2. Pre-Migration Backup

**Problem**: You need to migrate from vdisk to folder-based Docker storage.

**Solution**:
1. Open Docker Template Manager
2. Go to **Backups** tab
3. Click "Create New Backup"
4. All containers and templates are saved with their relationships
5. Proceed with migration knowing you can restore if needed

### 3. Container-Template Audit

**Problem**: Some containers don't have matching templates.

**Solution**:
1. Go to **Containers** tab
2. See which containers have templates and which don't
3. Containers without templates (e.g., Docker Compose) are clearly marked
4. Make informed decisions about which containers need manual backup

## 🔧 API Documentation

### Endpoints

#### Dashboard & Stats
```bash
GET /api/health          # Health check
GET /api/stats           # Dashboard statistics
```

#### Templates
```bash
GET /api/templates                    # List all templates
GET /api/templates/<filename>         # Get template content
DELETE /api/templates/<filename>      # Delete template
POST /api/templates/cleanup           # Clean up unused templates
  Body: { "dry_run": true/false }
```

#### Containers
```bash
GET /api/containers                   # List all containers
GET /api/containers/<name>            # Get container details
```

#### Backups
```bash
GET /api/backups                      # List all backups
POST /api/backups                     # Create new backup
  Body: { "name": "optional-name" }
DELETE /api/backups/<name>            # Delete backup
```

### Example: Clean Up Templates via API

```bash
# Dry run to see what would be deleted
curl -X POST http://localhost:8080/api/templates/cleanup \
  -H "Content-Type: application/json" \
  -d '{"dry_run": true}'

# Actually delete unused templates
curl -X POST http://localhost:8080/api/templates/cleanup \
  -H "Content-Type: application/json" \
  -d '{"dry_run": false}'
```

## 🛠️ Development

### Build from Source

```bash
# Clone repository
git clone https://github.com/yourusername/docker-template-manager.git
cd docker-template-manager

# Build Docker image
docker build -t docker-template-manager .

# Run container
docker-compose up -d
```

### Project Structure

```
docker-template-manager/
├── app.py                    # Flask backend
├── requirements.txt          # Python dependencies
├── Dockerfile               # Container definition
├── docker-compose.yml       # Compose configuration
├── static/                  # Frontend assets
│   ├── index.html
│   ├── App.jsx
│   └── App.css
├── unraid-template.xml      # Unraid template
└── README.md
```

### Tech Stack

- **Backend**: Python 3.11 + Flask
- **Frontend**: React 18
- **Docker SDK**: Python Docker SDK
- **Styling**: Modern CSS with gradients and animations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Changelog

### v1.0.0 (2024-10-14)
- Initial release
- Template cleanup functionality
- Backup and restore capabilities
- Container-template relationship mapping
- Modern web UI
- Safe deletion with automatic backups

## 🐛 Known Issues

- Backup restoration not yet implemented (coming in v1.1)
- Automatic cleanup scheduling not yet available
- Template editing in UI not yet supported

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Unraid community for inspiration
- Docker for their excellent Python SDK
- Flask and React teams for amazing frameworks

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/docker-template-manager/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/docker-template-manager/discussions)
- **Unraid Forums**: [Link to forum thread]

## ⚠️ Disclaimer

This tool modifies Docker templates on your Unraid server. While it creates automatic backups before any deletions, always ensure you have a complete system backup before performing major operations. Use at your own risk.

## 🎓 Tutorial

### First Time Setup

1. **Install the container** via Community Applications or manual template
2. **Access the web interface** at `http://[YOUR-SERVER-IP]:8080`
3. **Review the dashboard** to see your current template/container status
4. **Create your first backup** before making any changes

### Cleaning Up Templates

**Step-by-step guide:**

1. Go to **Templates** tab
2. Review the list - unused templates are marked with a red ✗
3. You can either:
   - **Bulk cleanup**: Click "Clean Up Unused" to remove all unused templates at once
   - **Selective cleanup**: Check individual templates and click "Delete Selected"
   - **Manual cleanup**: Click "Delete" on individual templates
4. All deletions are automatically backed up to `/backups/deleted-templates/`

**What happens during cleanup:**
```
1. Template is copied to backup directory with timestamp
2. Original template is deleted from templates-user directory
3. You can restore from backup if needed (manual process for now)
```

### Creating and Managing Backups

**When to create backups:**
- Before Docker vdisk to folder migration
- Before major container updates
- Weekly as a routine maintenance task
- Before cleaning up many templates

**What's included in a backup:**
- All template XML files
- Complete container configurations (docker inspect output)
- Container-to-template mapping file
- Metadata (timestamps, counts, etc.)

**Backup structure:**
```
/backups/backup-20241014-120000/
├── metadata.json                          # Backup information
├── container-template-mapping.json        # Relationship map
├── templates/                             # All template files
│   ├── my-plex.xml
│   ├── my-jellyfin.xml
│   └── ...
└── containers/                            # Container configs
    ├── plex.json
    ├── jellyfin.json
    └── ...
```

### Understanding the Dashboard

**Stats Cards:**
- **Templates**: Total templates and how many are matched/unused
- **Containers**: Total containers and how many are running
- **Backups**: Total number of backups available

**Quick Actions:**
- **Create Backup**: Instant backup of current state
- **Refresh Stats**: Update all statistics

**Alerts:**
- Yellow warning when unused templates are detected
- Click to run cleanup wizard

## 🔍 Troubleshooting

### Container won't start

**Issue**: Container fails to start with permission errors

**Solution**:
```bash
# Check permissions on mounted directories
ls -la /boot/config/plugins/dockerMan/templates-user
ls -la /mnt/user/appdata/docker-template-manager

# Fix permissions if needed
chmod -R 755 /mnt/user/appdata/docker-template-manager
```

### Can't see templates

**Issue**: Template list is empty

**Solution**:
1. Verify template directory path is correct: `/boot/config/plugins/dockerMan/templates-user`
2. Check container logs: `docker logs docker-template-manager`
3. Ensure templates directory exists: `ls /boot/config/plugins/dockerMan/templates-user`

### Templates not matching containers

**Issue**: All templates show as "unused" even though containers exist

**Solution**:
1. Check if Docker socket is mounted correctly
2. Verify containers are visible: `docker ps -a`
3. Review container logs for connection errors
4. This tool uses smart matching (handles `my-`, `wp-` prefixes and case differences)

### Backup failed

**Issue**: Backup creation fails

**Solution**:
```bash
# Check available disk space
df -h /mnt/user/appdata

# Check backup directory permissions
ls -la /mnt/user/appdata/docker-template-manager/backups

# Check container logs
docker logs docker-template-manager
```

### Can't access web UI

**Issue**: Web interface won't load

**Solution**:
1. Check container is running: `docker ps | grep docker-template-manager`
2. Check logs: `docker logs docker-template-manager`
3. Verify port 8080 isn't used by another service
4. Try accessing via server IP: `http://[SERVER-IP]:8080`
5. Check firewall settings

## 🔐 Security Considerations

### Docker Socket Access

The container requires **read-only** access to the Docker socket to list containers. This is a common pattern for Docker management tools.

**What it can do:**
- ✅ List containers and their details
- ✅ Read container configurations

**What it cannot do:**
- ❌ Start or stop containers
- ❌ Delete containers
- ❌ Modify container settings
- ❌ Access container data

### Template Directory Access

The container needs **read-write** access to the template directory to delete unused templates.

**Best practices:**
- Always create a backup before bulk operations
- Review the unused template list before deletion
- Use dry-run mode first
- Keep regular Unraid backups

### Network Security

**Recommendations:**
- Use Unraid's built-in authentication (nginx proxy)
- Don't expose port 8080 to the internet
- Use a VPN for remote access
- Consider adding basic auth if needed

## 📊 Migration Workflow

### Preparing for vdisk → folder migration

**Complete workflow:**

1. **Create baseline backup**
   ```
   - Open Docker Template Manager
   - Go to Backups tab
   - Click "Create New Backup"
   - Note the backup name
   ```

2. **Clean up unused templates**
   ```
   - Go to Templates tab
   - Review unused templates
   - Click "Clean Up Unused"
   - Verify cleanup completed
   ```

3. **Verify current state**
   ```
   - Check all containers are running
   - Verify all needed templates exist
   - Document any special configurations
   ```

4. **Perform Unraid migration**
   ```
   - Stop Docker service
   - Change Docker vDisk location to folder
   - Start Docker service
   ```

5. **Verify after migration**
   ```
   - Check all containers started correctly
   - Verify template-container relationships
   - Create post-migration backup
   ```

6. **Cleanup**
   ```
   - Old backups can be deleted after verification
   - Keep at least one pre-migration backup
   ```

## 🎨 Customization

### Changing the Port

**Via Docker Compose:**
```yaml
ports:
  - "9090:8080"  # Change 9090 to your desired port
```

**Via Unraid Template:**
1. Edit container
2. Change "WebUI Port" from 8080 to your desired port
3. Apply changes

### Changing Backup Location

**Via Docker Compose:**
```yaml
volumes:
  - /mnt/user/my-custom-backup-location:/backups:rw
```

**Via Unraid Template:**
1. Edit container
2. Change "Backups Directory" path
3. Apply changes

### Custom Environment Variables

Add to docker-compose.yml or Unraid template:
```yaml
environment:
  - BACKUP_RETENTION_DAYS=60  # Keep backups for 60 days
  - TZ=America/New_York       # Your timezone
```

## 📈 Roadmap

### v1.1 (Planned)
- [ ] Backup restoration functionality
- [ ] Template editing in UI
- [ ] Search and filter improvements
- [ ] Export templates to file
- [ ] Import templates from file

### v1.2 (Planned)
- [ ] Scheduled automatic backups
- [ ] Email notifications
- [ ] Template validation
- [ ] Dependency detection
- [ ] Docker Compose file import

### v2.0 (Future)
- [ ] Multi-server support
- [ ] Template marketplace
- [ ] Advanced analytics
- [ ] Container recreation wizard
- [ ] API key authentication

## 🤔 FAQ

**Q: Will this delete my containers?**  
A: No! This tool only manages template XML files. It never touches actual containers.

**Q: What if I accidentally delete a template I need?**  
A: All deletions are backed up to `/backups/deleted-templates/` with timestamps. You can manually restore them.

**Q: Can I use this on non-Unraid systems?**  
A: Technically yes, but it's designed specifically for Unraid's template structure. You'd need to adapt the paths.

**Q: Does this work with Docker Compose containers?**  
A: It will show them in the container list, but they won't have matching templates (as they're defined in compose files, not XML templates).

**Q: Is it safe to run this on a production server?**  
A: Yes, with caution. Always create a backup first, and review changes before applying them. The tool creates automatic backups before deletions.

**Q: How much disk space do backups use?**  
A: Templates are small (usually <10KB each). A full backup typically uses 1-5MB depending on your container count.

**Q: Can I schedule automatic cleanups?**  
A: Not yet, but it's planned for v1.2. For now, you can use Unraid's User Scripts plugin to call the API on a schedule.

**Q: Does this work with the new Unraid Docker backend?**  
A: Yes! It works with both the legacy and new Docker implementations in Unraid 6.12+.

---

**Made with ❤️ for the Unraid community**

If this tool helped you, consider starring the repo on GitHub! ⭐