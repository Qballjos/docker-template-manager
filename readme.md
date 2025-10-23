# Docker Template Manager for Unraid

Clean up unused Docker templates and manage your Unraid templates with a modern web interface.

![Unraid](https://img.shields.io/badge/Unraid-Compatible-orange.svg)
![Version](https://img.shields.io/badge/Version-1.3.0-blue.svg)
![Security](https://img.shields.io/badge/Security-Hardened-green.svg)

---

## 🚀 Installation

### Quick Install (2 minutes)

1. **Apps** → Search **"Docker Template Manager"** → **Install**
2. Leave all default settings (they're correct!)
3. **Set your API Key** in environment variables (or leave empty for auto-generate)
4. **Click Apply**
5. Check **Docker logs** for your API key if auto-generated
6. Click **WebUI** → Enter your API key → Done!

**That's it!** 🎉

---

## ✨ Features

### Core Features
- **📊 Dashboard** - Visual stats with pie chart
- **🔍 Search & Filter** - Find templates instantly  
- **Smart Matching** - Auto-matches templates to containers  
- **Template Cleanup** - Remove unused templates safely
- **💾 One-Click Backups** - Backup all containers & templates
- **🔐 Secure** - API key authentication, all vulnerabilities fixed

### New in v1.3.0
- **🎨 Professional UI** - *arr-style sidebar navigation
- **🌓 Theme Toggle** - Dark/Light mode with persistence
- **🎮 Container Controls** - Start/Stop/Restart containers directly
- **📱 Mobile Responsive** - Hamburger menu and touch-friendly
- **📚 Migration Guides** - Docker vDisk to folder conversion guides
- **🔍 Enhanced Search** - Real-time template search and filtering
- **📊 Visual Dashboard** - Pie chart and comprehensive stats

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

### Search & Filter Templates

**Templates Tab:**
1. Use search box to find templates by name
2. Filter dropdown: All/Matched/Unused
3. Sort dropdown: Name/Size/Date
4. Clear with ✕ button

### Dashboard Overview

**Visual Stats:**
- Template count with matched/unused breakdown
- Container count with running status
- Backup count
- **Pie Chart** showing template health

### Cleanup Unused Templates

1. **Templates** tab → **Cleanup Unused**
2. Review list (templates without containers)
3. Click **Confirm** or **Cancel**
4. Auto-backed up to `/backups/deleted-templates/`

### Create Backup

1. **Backups** tab → **Create Backup**
2. Optional: Custom name
3. Includes:
   - All template XML files
   - Container configurations (JSON)
   - Template-to-container mapping

### Restore Backup

1. **Backups** tab → Find your backup
2. Click **Restore**
3. Templates copied back to templates directory

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
- Port 8080 free? (not used by another app)
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

- **v1.3.0** (Current) - Professional UI, theme toggle, container controls, migration guides
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
- Template preview/edit
- Clone/copy templates
- Scheduled backups
- Export/import
- Container actions (start/stop)

---

## 📝 License

MIT License - Feel free to use and modify

---

## 🙏 Credits

Built for the Unraid community to make Docker template management easier and safer.

**Community Apps:** Available in Unraid Community Applications

---

**Current Version:** 1.3.0  
**Unraid Tested:** 6.11+  
**Status:** ✅ Production Ready  
**Security:** ✅ All vulnerabilities fixed
