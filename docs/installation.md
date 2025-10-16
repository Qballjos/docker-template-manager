# Installation Guide

Docker Template Manager can be installed on Unraid in multiple ways. Choose the method that works best for you.

---

## Table of Contents

1. [Quick Start (Recommended)](#quick-start-recommended)
2. [Manual Installation](#manual-installation)
3. [Docker Compose Installation](#docker-compose-installation)
4. [Verification](#verification)
5. [Troubleshooting](#troubleshooting)
6. [Uninstallation](#uninstallation)

---

## Quick Start (Recommended)

The easiest way to install Docker Template Manager is through Unraid's Community Applications.

### Prerequisites

- Unraid 6.8 or later
- Docker installed and running on your Unraid server
- Internet connectivity to download the Docker image

### Installation Steps

1. **Open Unraid Web Interface**
   - Navigate to `http://[YOUR-UNRAID-IP]`
   - Go to the **Apps** tab

2. **Search for Docker Template Manager**
   - Click the search icon
   - Type "Docker Template Manager"
   - Or search for "template" or "manager"

3. **Install the Container**
   - Click on the Docker Template Manager result
   - Click the **Install** button
   - Accept the default settings or customize if needed

4. **Configure (Optional)**
   - **WebUI Port**: Default is 8080 (change if needed)
   - **Templates Directory**: Default is `/boot/config/plugins/dockerMan/templates-user` (do not change)
   - **Backups Directory**: Default is `/mnt/user/appdata/docker-template-manager/backups` (optional change)

5. **Start the Container**
   - Click **Apply** to start the container
   - Wait 30-60 seconds for the first start

6. **Access the Web Interface**
   - Open your browser
   - Navigate to `http://[YOUR-UNRAID-IP]:8080`
   - The dashboard should load showing your templates and containers

---

## Manual Installation

If Community Applications are not available or you prefer manual installation:

### Step 1: Pull the Docker Image

```bash
docker pull Qballjos/docker-template-manager:latest
```

### Step 2: Create Directories

Create the necessary directories on your Unraid server:

```bash
mkdir -p /mnt/user/appdata/docker-template-manager/backups
mkdir -p /mnt/user/appdata/docker-template-manager/config
```

### Step 3: Create the Container

Using Unraid's Docker UI:

1. Go to **Docker** tab
2. Click **Add Container**
3. Select **Template repositories**: `https://raw.githubusercontent.com/Qballjos/docker-template-manager/master/unraid-template.xml`
4. Select **Docker Template Manager** from the dropdown
5. Click **Apply**

Or use the command line:

```bash
docker run -d \
  --name docker-template-manager \
  -p 8080:8080 \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -v /boot/config/plugins/dockerMan/templates-user:/templates:rw \
  -v /mnt/user/appdata/docker-template-manager/backups:/backups:rw \
  -v /mnt/user/appdata/docker-template-manager/config:/config:rw \
  -e TEMPLATE_DIR=/templates \
  -e BACKUP_DIR=/backups \
  -e CONFIG_DIR=/config \
  -e TZ=Europe/Amsterdam \
  --restart unless-stopped \
  Qballjos/docker-template-manager:latest
```

### Step 4: Access the Application

Open your browser and navigate to:

```
http://[YOUR-UNRAID-IP]:8080
```

---

## Docker Compose Installation

For users who prefer Docker Compose:

### Step 1: Create docker-compose.yml

Create a file named `docker-compose.yml` in your Unraid appdata directory:

```bash
mkdir -p /mnt/user/appdata/docker-template-manager
cd /mnt/user/appdata/docker-template-manager
nano docker-compose.yml
```

### Step 2: Paste Configuration

Copy and paste the following configuration:

```yaml
version: '3.8'

services:
  docker-template-manager:
    image: Qballjos/docker-template-manager:latest
    container_name: docker-template-manager
    ports:
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /boot/config/plugins/dockerMan/templates-user:/templates:rw
      - /mnt/user/appdata/docker-template-manager/backups:/backups:rw
      - /mnt/user/appdata/docker-template-manager/config:/config:rw
    environment:
      - TZ=Europe/Amsterdam
      - TEMPLATE_DIR=/templates
      - BACKUP_DIR=/backups
      - CONFIG_DIR=/config
      - BACKUP_RETENTION_DAYS=30
      - AUTO_CLEANUP_ENABLED=false
    restart: unless-stopped
```

### Step 3: Start the Container

```bash
cd /mnt/user/appdata/docker-template-manager
docker-compose up -d
```

### Step 4: View Logs

```bash
docker-compose logs -f
```

### Step 5: Access the Application

Open your browser and navigate to:

```
http://[YOUR-UNRAID-IP]:8080
```

---

## Configuration

### Environment Variables

The following environment variables can be configured:

| Variable | Default | Description |
|----------|---------|-------------|
| `TEMPLATE_DIR` | `/templates` | Path to template directory (mount point) |
| `BACKUP_DIR` | `/backups` | Path to backups directory (mount point) |
| `CONFIG_DIR` | `/config` | Path to config directory (mount point) |
| `TZ` | `Europe/Amsterdam` | Timezone for backup timestamps |
| `BACKUP_RETENTION_DAYS` | `30` | Days to keep old backups (future feature) |
| `AUTO_CLEANUP_ENABLED` | `false` | Enable automatic cleanup (future feature) |

### Port Configuration

By default, Docker Template Manager runs on port 8080. To change this:

**In Unraid Docker UI:**
1. Edit the container
2. Change "WebUI Port" to your desired port (e.g., 9090)
3. Click **Apply**

**In docker-compose.yml:**
```yaml
ports:
  - "9090:8080"  # Change 9090 to your desired port
```

### Backup Location

To store backups in a different location:

**In Unraid Docker UI:**
1. Edit the container
2. Change "Backups Directory" path
3. Create the new directory if it doesn't exist
4. Click **Apply**

**In docker-compose.yml:**
```yaml
volumes:
  - /mnt/user/custom-backups:/backups:rw
```

---

## Verification

### Check Container Status

**In Unraid UI:**
1. Go to **Docker** tab
2. Look for "docker-template-manager"
3. Status should show a green running indicator

**Command line:**
```bash
docker ps | grep docker-template-manager
```

### Verify Web Interface

1. Open browser: `http://[YOUR-UNRAID-IP]:8080`
2. You should see the Dashboard with statistics
3. Check that Templates and Containers tabs load data

### Check API Health

```bash
curl http://localhost:8080/api/health
```

Should return:
```json
{
  "status": "healthy",
  "docker": "connected",
  "template_dir": true,
  "timestamp": "2024-10-14T12:34:56.789012"
}
```

### View Container Logs

**In Unraid UI:**
1. Go to **Docker** tab
2. Right-click on docker-template-manager
3. Select **View Logs**

**Command line:**
```bash
docker logs docker-template-manager
```

---

## First Use

### Initial Dashboard

When you first access the application:

1. **Dashboard** tab shows:
   - Total templates and containers
   - Number of matched/unused templates
   - Running containers count
   - Backup statistics

2. **Templates** tab shows:
   - All template files
   - Status (matched/unused) with color coding
   - Associated container for each template
   - File size and modification date

3. **Containers** tab shows:
   - All Docker containers (running and stopped)
   - Container status (running/exited)
   - Associated template (if available)

4. **Backups** tab shows:
   - List of all backups
   - Backup creation date
   - Backup size
   - Container and template counts in backup

### Recommended First Steps

1. **Review Your Setup**
   - Go to Dashboard to see current state
   - Check Templates tab to review all templates
   - Look for red "✗ Unused" templates

2. **Create a Backup**
   - Click "Create New Backup" in Backups tab
   - This creates a full backup before making changes
   - Useful as a safety net

3. **Clean Up (Optional)**
   - In Templates tab, click "🧹 Clean Up Unused"
   - Preview shows templates without matching containers
   - Confirm to remove unused templates

4. **Monitor**
   - Check Dashboard regularly for new unused templates
   - Monitor container status in Containers tab

---

## Troubleshooting

### Web Interface Won't Load

**Problem**: Blank page or "Cannot GET /" error

**Solutions**:

1. Check container is running:
   ```bash
   docker ps | grep docker-template-manager
   ```

2. View logs for errors:
   ```bash
   docker logs docker-template-manager
   ```

3. Verify port is not in use:
   ```bash
   netstat -an | grep 8080
   ```

4. Check firewall settings on Unraid

5. Try accessing with IP address instead of hostname:
   ```
   http://192.168.1.100:8080  (replace with your IP)
   ```

### Docker Socket Error

**Problem**: "Cannot connect to Docker daemon"

**Solutions**:

1. Verify Docker socket mount in container:
   ```bash
   docker inspect docker-template-manager | grep -A 10 Mounts
   ```

2. Check Docker socket exists:
   ```bash
   ls -la /var/run/docker.sock
   ```

3. Verify permissions:
   ```bash
   ls -la /var/run/docker.sock
   # Should show: srw-rw---- 1 root docker
   ```

4. Restart Docker service:
   - Unraid Settings → Docker → toggle Enabled off, then back on
   - Wait 1-2 minutes

5. Restart container:
   ```bash
   docker restart docker-template-manager
   ```

### Templates Not Showing

**Problem**: Templates tab is empty or shows 0 templates

**Solutions**:

1. Verify template directory exists:
   ```bash
   ls -la /boot/config/plugins/dockerMan/templates-user
   ```

2. Check container can access templates:
   ```bash
   docker exec docker-template-manager ls /templates
   ```

3. Verify volume mount:
   - View container details in Unraid Docker UI
   - Check "Binds" section shows templates path

4. Check file permissions:
   ```bash
   chmod -R 755 /boot/config/plugins/dockerMan/templates-user
   ```

### Containers Not Showing

**Problem**: Containers tab is empty

**Solutions**:

1. Verify Docker socket is mounted correctly:
   ```bash
   docker exec docker-template-manager docker ps -a
   ```

2. Check API health:
   ```bash
   curl http://localhost:8080/api/health
   ```
   Should show `"docker": "connected"`

3. Restart container:
   ```bash
   docker restart docker-template-manager
   ```

### Backup Storage Full

**Problem**: Backups tab shows error or backups not created

**Solutions**:

1. Check available disk space:
   ```bash
   df -h /mnt/user/appdata/docker-template-manager
   ```

2. Delete old backups:
   - Go to Backups tab
   - Click Delete on old backups you don't need

3. Move backups to larger drive:
   ```bash
   # Copy existing backups
   cp -r /mnt/user/appdata/docker-template-manager/backups /mnt/disk2/

   # Update container volume mount
   # Edit container and change Backups Directory path
   ```

### High CPU Usage

**Problem**: Container using excessive CPU

**Solutions**:

1. Check for errors in logs:
   ```bash
   docker logs docker-template-manager
   ```

2. Restart container:
   ```bash
   docker restart docker-template-manager
   ```

3. If issue persists, update to latest version:
   ```bash
   docker pull Qballjos/docker-template-manager:latest
   docker-compose down
   docker-compose up -d
   ```

---

## Uninstallation

### Remove Container

**In Unraid UI:**
1. Go to **Docker** tab
2. Right-click on docker-template-manager
3. Select **Delete**
4. Confirm deletion

**Command line:**
```bash
docker stop docker-template-manager
docker rm docker-template-manager
```

### Remove Docker Image

```bash
docker rmi Qballjos/docker-template-manager:latest
```

### Remove Application Data

```bash
# Remove all application data
rm -rf /mnt/user/appdata/docker-template-manager

# Or keep backups and just remove app cache
rm -rf /mnt/user/appdata/docker-template-manager/config
```

### Clean Up Volumes (Optional)

```bash
# Remove unused Docker volumes
docker volume prune
```

---

## System Requirements

- **Unraid**: 6.8 or later
- **Docker**: Running and functional
- **Disk Space**: 
  - Application: ~200 MB
  - Backups: Varies (typically 2-10 MB per backup)
- **RAM**: 
  - Minimum: 512 MB
  - Recommended: 1-2 GB
- **CPU**: 
  - Minimum: 1 core
  - Recommended: 2+ cores

---

## Performance Tips

1. **Regular Backups**
   - Create backups weekly
   - Delete backups older than 30 days
   - Monitor backup storage usage

2. **Template Cleanup**
   - Remove unused templates monthly
   - Review before cleanup to ensure safety

3. **Container Monitoring**
   - Check Containers tab regularly
   - Identify and document containers without templates

4. **Disk Space**
   - Monitor available space in appdata
   - Move backups to larger storage if needed
   - Check template directory permissions

---

## Getting Help

If you encounter issues:

1. **Check Logs**: `docker logs docker-template-manager`
2. **Review API**: `curl http://localhost:8080/api/health`
3. **Verify Mounts**: Ensure all volume mounts are correct
4. **Community**: Check Unraid Forums for Docker Template Manager discussions
5. **GitHub Issues**: Report bugs at https://github.com/Qballjos/docker-template-manager/issues

---

## Version History

### v1.0.0 (Current)
- Initial release
- Template cleanup and management
- Container monitoring
- Backup functionality
- Modern web interface

---

## Support & Feedback

- **GitHub Repository**: https://github.com/Qballjos/docker-template-manager
- **Bug Reports**: https://github.com/Qballjos/docker-template-manager/issues
- **Feature Requests**: https://github.com/Qballjos/docker-template-manager/discussions

---

## Next Steps

After installation:

1. Review your templates and containers on the Dashboard
2. Create your first backup
3. (Optional) Clean up unused templates
4. Bookmark `http://[YOUR-IP]:8080` for easy access
5. Monitor regularly for new unused templates