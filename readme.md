# Docker Template Manager for Unraid

Clean up unused Docker templates and manage your Unraid templates with a modern web interface.

![Unraid](https://img.shields.io/badge/Unraid-Compatible-orange.svg)
![Version](https://img.shields.io/badge/Version-1.1.0-blue.svg)

---

## 🚀 Installation

### Quick Install (2 minutes)

1. **Apps** → Search **"Docker Template Manager"** → **Install**
2. Leave all default settings (they're correct!)
3. **Click Apply**
4. **Docker tab** → Container **icon** → **Logs**
5. Copy the API key: `Generated temporary key: xxxxx`
6. Click **WebUI** → Enter your API key → Done!

**That's it!** 🎉

---

## ✨ Features

- **Dashboard** - Stats overview
- **Smart Matching** - Auto-matches templates to containers  
- **Template Cleanup** - Remove unused templates safely
- **One-Click Backups** - Backup all containers & templates
- **Safe Operations** - Auto-backup before deletions

---

## 🔑 API Key

Your API key is auto-generated on first start.

**Find it:** Docker → Container icon → Logs → Look for:
```
Generated temporary key: AbCdEf123...
```

**Generate custom key:**
```bash
openssl rand -base64 32
```
Then add to container's `API_KEY` variable.

---

## 📋 Usage

### Cleanup Unused Templates
1. **Templates** tab → **Cleanup Unused**
2. Review list → **Confirm**
3. Done! (Auto-backed up first)

### Create Backup
1. **Backups** tab → **Create Backup**
2. Optional: Name it
3. Done!

### Restore Backup
1. **Backups** tab → Find backup
2. Click **Restore**
3. Done!

---

## 🔧 Configuration

### Default Paths (Don't Change!)
- **Templates:** `/boot/config/plugins/dockerMan/templates-user`
- **Backups:** `/mnt/user/appdata/docker-template-manager/backups`
- **Config:** `/mnt/user/appdata/docker-template-manager/config`

### Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `API_KEY` | Auto | Your auth key |
| `TZ` | America/New_York | Timezone |
| `FLASK_DEBUG` | false | Keep false! |

---

## 🆘 Troubleshooting

**"401 Unauthorized"**
- Check Docker logs for API key
- Clear browser cache

**"Template directory not found"**
- Default path should work: `/boot/config/plugins/dockerMan/templates-user`
- Verify it exists: `ls -la /boot/config/plugins/dockerMan/`

**"Can't access WebUI"**
- Container running? (green dot)
- Port 8080 free?
- API key correct?

**Lost API Key?**
- Check Docker logs (usually there)
- Or regenerate: Stop → Clear `API_KEY` → Start → Check logs

---

## 🔒 Security

Version 1.1.0 includes:
- ✅ API key authentication
- ✅ Path traversal protection
- ✅ Input validation
- ✅ Security headers
- ✅ Updated dependencies
- ✅ CORS protection

**Your API key = Your password. Keep it private!**

---

## 📦 Updates

**Updating:**
1. Docker tab → **Check for Updates**
2. Click **Update**
3. API key preserved automatically

---

## 🐛 Support

- **Unraid Forums:** Search "Docker Template Manager"
- **GitHub Issues:** [Report bugs](https://github.com/yourusername/docker-template-manager/issues)

---

## 📝 Additional Docs

- [SECURITY.md](SECURITY.md) - Security details
- [CHANGELOG.md](CHANGELOG.md) - Version history

---

**Version:** 1.1.0 • **Unraid:** 6.11+ • **License:** MIT
