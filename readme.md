# Docker Template Manager for Unraid

<div align="center">

![Docker Template Manager](https://img.shields.io/badge/Docker%20Template%20Manager-v1.4.0-blue.svg)
![Unraid](https://img.shields.io/badge/Unraid-Compatible-orange.svg)
![Security](https://img.shields.io/badge/Security-Hardened-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**Professional Docker template management for Unraid with modern web interface**

[🚀 Quick Start](#-installation) • [📖 Documentation](#-features) • [🐛 Report Bug](https://github.com/qballjos/docker-template-manager/issues) • [💡 Request Feature](https://github.com/qballjos/docker-template-manager/issues)

</div>

---

## 🎯 About

**Docker Template Manager** is a professional-grade web application designed specifically for Unraid users who want to efficiently manage their Docker templates, containers, and backups. Built with modern web technologies and following professional development standards, it provides a clean, intuitive interface for organizing your Docker ecosystem.

### 🚀 What Makes It Special?

Docker Template Manager isn't just another Docker management tool - it's a **comprehensive solution** built specifically for the Unraid ecosystem. Unlike generic Docker managers, it understands Unraid's unique template system and provides specialized tools for managing your home lab infrastructure.

#### 🎯 **Core Philosophy**
- **Simplicity First** - Complex Docker management made simple
- **Unraid Native** - Built specifically for Unraid's template system
- **Professional Grade** - Enterprise-level features for home lab users
- **User-Centric** - Designed by Unraid users, for Unraid users

### ✨ Why Docker Template Manager?

- **🧹 Clean Up Clutter** - Identify and remove unused Docker templates automatically
- **📊 Professional Dashboard** - Get insights into your Docker environment at a glance  
- **🔄 Container Management** - Start, stop, and restart containers with ease
- **💾 Backup & Restore** - Create and manage backups of your templates and containers
- **🎨 Modern UI** - Professional interface with dark/light theme support
- **📱 Mobile Responsive** - Works perfectly on desktop, tablet, and mobile devices
- **🔒 Secure** - API key authentication and secure file operations
- **⚡ Fast** - Optimized for performance with sortable tables and bulk operations

### 🎯 Perfect For

- **🏠 Home Lab Enthusiasts** - Manage complex Docker setups with ease
- **⚡ Unraid Power Users** - Advanced template and container management
- **🔧 System Administrators** - Professional Docker management tools
- **📚 Learning Users** - Understand and organize your Docker ecosystem
- **🚀 Power Users** - Bulk operations and advanced features
- **📱 Mobile Users** - Full functionality on any device

### 🏆 Professional Features

#### **📊 Dashboard & Analytics**
- **📈 Real-time Statistics** - Live container and template metrics
- **📋 Quick Actions** - One-click access to common operations
- **🔍 System Overview** - Complete Docker environment visibility
- **📱 Responsive Design** - Perfect on desktop, tablet, and mobile

#### **🔧 Template Management**
- **📝 Hybrid Editor** - Form-based editing with raw XML fallback
- **🔍 Advanced Search** - Find templates by name, repository, or tags
- **📋 Sortable Tables** - Organize by name, size, date, or status
- **🎛️ Bulk Operations** - Select multiple templates for batch actions
- **🧹 Cleanup Tools** - Identify and remove unused templates

#### **🐳 Container Management**
- **🔄 Lifecycle Control** - Start, stop, restart containers with one click
- **📊 Status Monitoring** - Real-time container state and health
- **🎛️ Bulk Actions** - Manage multiple containers simultaneously
- **📱 Mobile Controls** - Full container management on mobile devices

#### **💾 Backup & Restore**
- **🔄 Automated Backups** - Schedule and manage template backups
- **📦 Export/Import** - Share templates between Unraid systems
- **🔄 Migration Tools** - Built-in guides for common scenarios
- **📊 Backup Analytics** - Track backup sizes and frequencies

#### **🎨 User Experience**
- **🌙 Theme Support** - Dark and light modes with system detection
- **📱 Mobile Optimized** - Touch-friendly interface for all devices
- **⚡ Performance** - Optimized for speed and responsiveness
- **🔒 Security** - API key authentication and secure operations

### 🌟 **What Sets It Apart**

#### **🏠 Built for Unraid**
- **Native Integration** - Works seamlessly with Unraid's template system
- **Unraid-Specific Features** - Tools designed for Unraid workflows
- **Template Compatibility** - Supports all Unraid template formats
- **Community Focused** - Built by and for the Unraid community

#### **🚀 Modern Technology**
- **React Frontend** - Modern, responsive user interface
- **Flask Backend** - Fast, secure API with Python
- **Docker Native** - Built with Docker best practices
- **Professional Standards** - Enterprise-grade code quality

#### **📚 Comprehensive Documentation**
- **📖 Built-in Guides** - Migration and setup documentation
- **🎯 Quick Start** - Get running in minutes
- **🔧 Advanced Usage** - Power user features and tips
- **💡 Best Practices** - Professional Docker management guidance

---

## 🚀 Installation

### Method 1: Unraid Community Applications (Recommended)

1. **Apps** → **Community Applications** → Search **"Docker Template Manager"**
2. **Install** → Leave all default settings (they're correct!)
3. **Set your API Key** in environment variables (or leave empty for auto-generate)
4. **Click Apply**
5. Check **Docker logs** for your API key if auto-generated
6. Click **WebUI** → Enter your API key → Done!

**That's it!** 🎉

### Method 2: Manual Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  docker-template-manager:
    image: ghcr.io/qballjos/docker-template-manager:latest
    container_name: docker-template-manager
    ports:
      - "8889:8889"
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
      - API_KEY=your-secure-api-key-here
    restart: unless-stopped
```

### Method 3: Docker Run Command

```bash
docker run -d \
  --name docker-template-manager \
  -p 8889:8889 \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -v /boot/config/plugins/dockerMan/templates-user:/templates:rw \
  -v /mnt/user/appdata/docker-template-manager/backups:/backups:rw \
  -v /mnt/user/appdata/docker-template-manager/config:/config:rw \
  -e TZ=Europe/Amsterdam \
  -e TEMPLATE_DIR=/templates \
  -e BACKUP_DIR=/backups \
  -e CONFIG_DIR=/config \
  -e API_KEY=your-secure-api-key-here \
  --restart unless-stopped \
  ghcr.io/qballjos/docker-template-manager:latest
```

---

## ✨ Features

### 🎯 Core Capabilities

#### 📊 **Dashboard & Analytics**
- **Visual Statistics** - Comprehensive overview with pie charts
- **Real-time Data** - Live container and template counts
- **Health Monitoring** - Template usage and container status
- **Quick Actions** - One-click navigation to all sections

#### 🔍 **Template Management**
- **Smart Search & Filter** - Find templates instantly with real-time search
- **Sortable Tables** - Click column headers to sort by name, size, date, status
- **Template Editor** - Hybrid form-based and raw XML editing
- **Bulk Operations** - Select multiple templates for batch actions
- **Cleanup Tools** - Safely remove unused templates with backup
- **Template Matching** - Auto-detect which templates are in use

#### 🐳 **Container Management**
- **Container Controls** - Start, stop, restart containers directly
- **Sortable Container List** - Sort by name, image, state
- **Bulk Container Actions** - Stop/restart multiple containers
- **Container Status** - Real-time running/stopped status
- **Template Association** - See which containers have templates

#### 💾 **Backup & Restore**
- **One-Click Backups** - Backup all templates and container configs
- **Automatic Naming** - Timestamped backup files
- **Restore Functionality** - Restore templates from backups
- **Backup Management** - List, delete, and restore backups

#### 🎨 **User Interface**
- **Professional Design** - *arr-style sidebar navigation
- **Theme Toggle** - Dark/Light mode with persistence
- **Mobile Responsive** - Hamburger menu and touch-friendly design
- **Sortable Tables** - Click any column header to sort
- **Visual Indicators** - Clear status badges and icons
- **Keyboard Shortcuts** - Power user navigation

### 🆕 **New in v1.4.0**
- **Sortable Tables** - Click any column header to sort data
- **Hybrid Template Editor** - Form-based editing with XML toggle
- **Bulk Operations** - Select multiple items for batch actions
- **Professional Button Styling** - Consistent UI across all sections
- **Enhanced Container Management** - Direct container controls
- **Improved Navigation** - Clickable dashboard cards

---

## 🔑 API Key Setup

### First Time Setup

Your API key is required for security. You have two options:

**Option 1: Auto-Generate (Easiest)**
1. Install with empty `API_KEY` variable
2. Check Docker logs: Docker tab → Container icon → Logs
3. Find: `Generated temporary key: xxxxx`
4. Save this key for accessing the WebUI

**Option 2: Custom Key**
1. Generate: `openssl rand -base64 32`
2. Add to container's `API_KEY` environment variable
3. Use this key in the WebUI

**Finding Your Key:**
- **Unraid:** Docker tab → Container icon → Logs
- **Environment:** Check your container's `API_KEY` variable

---

## 📋 Usage

### 🏠 **Dashboard Overview**

**Visual Statistics:**
- **Template Health** - Pie chart showing matched vs unused templates
- **Container Status** - Running vs stopped containers
- **Backup Count** - Total backups available
- **Quick Navigation** - Click any stat card to jump to that section

### 🔍 **Template Management**

**Templates Tab:**
1. **Search** - Real-time search by template name or container name
2. **Filter** - All/Matched/Unused templates
3. **Sort** - Click column headers to sort by:
   - **Status** - Matched/Unused
   - **Template** - Filename (A-Z)
   - **Container** - Associated container name
   - **Size** - File size (largest first)
   - **Modified** - Date (newest first)
4. **Bulk Actions** - Select multiple templates for batch operations
5. **Individual Actions** - Click template row to see actions underneath

**Template Editor:**
- **Form Mode** - User-friendly form fields for easy editing
- **Raw XML Mode** - Toggle to edit XML directly
- **Port Management** - Add/remove port mappings
- **Volume Management** - Add/remove volume mounts
- **Environment Variables** - Add/remove environment settings

### 🐳 **Container Management**

**Containers Tab:**
1. **Sort** - Click column headers to sort by:
   - **Name** - Container name (A-Z)
   - **Image** - Docker image name
   - **State** - Running/Stopped status
2. **Individual Actions** - Click container row to see actions underneath
3. **Bulk Actions** - Select multiple containers for batch operations
4. **Container Controls** - Start, stop, restart containers directly

### 💾 **Backup & Restore**

**Create Backup:**
1. **Backups** tab → **Create Backup**
2. Automatic timestamped naming
3. Includes all templates and container configurations

**Restore Backup:**
1. **Backups** tab → Find your backup
2. Click **Restore**
3. Templates restored to original location

**Backup Management:**
- **List Backups** - See all available backups
- **Delete Backups** - Remove old backups
- **Restore** - Restore from any backup

---

## 🔧 Configuration

### Default Paths (Preconfigured)

| Path | Default | Purpose |
|------|---------|---------|
| Templates | `/boot/config/plugins/dockerMan/templates-user` | Unraid templates |
| Backups | `/mnt/user/appdata/docker-template-manager/backups` | Backup storage |
| Config | `/mnt/user/appdata/docker-template-manager/config` | App settings |

**Don't change these unless you have custom template locations!**

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `API_KEY` | Auto-generated | Authentication key (required) |
| `ALLOWED_ORIGINS` | Auto-set | CORS security |
| `TZ` | America/New_York | Your timezone |
| `FLASK_DEBUG` | false | Keep false for security! |

---

## 🆘 Troubleshooting

### "401 Unauthorized"
**Problem:** API key missing or incorrect

**Solution:**
1. Check Docker logs for your API key
2. Clear browser cache
3. Try incognito/private window
4. Re-enter API key

### "Template directory not found"
**Problem:** Path configuration incorrect

**Solution:**
1. Default path: `/boot/config/plugins/dockerMan/templates-user`
2. Verify: `ls -la /boot/config/plugins/dockerMan/`
3. If custom location, update path in container settings

### "Can't access WebUI"
**Problem:** Container or port issue

**Solution:**
- Container running? (green dot in Docker tab)
- Port 8889 free? (not used by another app)
- API key correct?
- Browser cache cleared?

### Lost API Key
**Solution:**
1. Check Docker logs first (usually there)
2. Or regenerate: Stop → Clear `API_KEY` → Start → Check logs
3. New key auto-generated

### Search not working
**Problem:** Browser cache

**Solution:**
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Force update container

---

## 📦 Updates

### Updating the Container

1. Docker tab → **Check for Updates**
2. If available, click **Update**
3. API key preserved automatically
4. Hard refresh browser (Ctrl+F5)

### Version History

- **v1.4.0** (Current) - Sortable tables, hybrid template editor, bulk operations, professional styling
- **v1.3.0** - Professional UI, theme toggle, container controls, migration guides
- **v1.2.0** - Search/filter, pie chart, improved UX
- **v1.1.0** - Security hardening, API authentication
- **v1.0.0** - Initial release

---

## 🔒 Security

### What's Protected

- ✅ **API Key Authentication** - All endpoints secured
- ✅ **Path Traversal Prevention** - No directory attacks
- ✅ **Input Validation** - All inputs sanitized
- ✅ **Security Headers** - XSS, MIME-sniffing, clickjacking protection
- ✅ **CORS Protection** - Restricted to your Unraid IP
- ✅ **Updated Dependencies** - Latest secure versions
- ✅ **No Debug Mode** - Disabled in production

### Best Practices

1. **Keep API key private** - It's like a password
2. **Don't expose to internet** - Local network only
3. **Use VPN for remote access**
4. **Update regularly** - Check for updates monthly
5. **Monitor logs** - Check for unusual activity

**Your API key = Your password. Keep it safe!**

---

## 🎯 Keyboard Shortcuts

- **Ctrl+F** - Focus search box
- **Escape** - Clear search
- **Arrow Keys** - Navigate tables

---

## 🐛 Support

- **Unraid Forums:** Search "Docker Template Manager"
- **GitHub Issues:** [Report bugs](https://github.com/yourusername/docker-template-manager/issues)
- **Security Issues:** See [SECURITY.md](SECURITY.md)

---

## 📚 Additional Docs

- [SECURITY.md](SECURITY.md) - Security details
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [docs/api.md](docs/api.md) - API reference

---

## 🎉 What's Next?

Upcoming features being considered:
- **Scheduled Backups** - Automated backup scheduling
- **Template Cloning** - Copy and modify existing templates
- **Advanced Search** - Search within template content
- **Export/Import** - Share templates between systems
- **Container Logs** - View container logs directly
- **Template Validation** - Validate XML before saving
- **Bulk Template Operations** - Mass edit multiple templates

---

## 📝 License

MIT License - Feel free to use and modify

---

## 🙏 Credits

Built for the Unraid community to make Docker template management easier and safer.

**Community Apps:** Available in Unraid Community Applications

---

**Current Version:** 1.4.0  
**Unraid Tested:** 6.11+  
**Status:** ✅ Production Ready  
**Security:** ✅ All vulnerabilities fixed  
**Features:** ✅ Sortable Tables | Hybrid Editor | Bulk Operations
