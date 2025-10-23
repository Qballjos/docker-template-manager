# Unraid Folder → vDisk Migration Guide (Using Docker Template Manager)

This guide explains how to migrate your Unraid Docker setup from **folder-based storage** back to a **vDisk-based setup** using the [Docker Template Manager](https://github.com/Qballjos/docker-template-manager) web interface.

---

## 🧠 Why Switch Back?

While folder mode offers flexibility, vDisk can be:
- **Easier to manage** for beginners
- **Simpler for snapshot-based backups**
- **Useful for systems** with limited shares or SMB exposure
- **Single file simplicity** for backup and migration

---

## ⚙️ Step 1: Backup Templates

Before making any changes, backup all Docker templates using Docker Template Manager:

1. **Access Docker Template Manager** at `http://your-unraid-ip:8889`
2. **Go to Backups tab**
3. **Click "Create Backup"** button
4. **Wait for backup completion** - this saves all templates to `/mnt/user/appdata/docker-template-manager/backups/`

---

## 🧱 Step 2: Stop Docker Service

**In the Unraid web interface:**
1. Go to **Settings → Docker**
2. Set **Enable Docker** to **No**
3. Click **Apply**

**Or via terminal:**
```bash
/etc/rc.d/rc.docker stop
```

---

## 🧹 Step 3: Prepare vDisk

1. **Create a new vDisk file** (e.g., `docker.img`):
   ```bash
   mkdir -p /mnt/user/system/docker/
   truncate -s 30G /mnt/user/system/docker/docker.img
   ```
   > **Adjust size** (`30G`) to your needs. Consider your current Docker usage.

2. **Configure Docker data-root**:
   - Go to **Settings → Docker → Docker data-root**
   - Set to: `/mnt/user/system/docker/docker.img`
   - **Enable Docker** and click **Apply**

---

## 🚀 Step 4: Restore Containers

Use Docker Template Manager to restore all containers from the backup:

1. **Access Docker Template Manager** at `http://your-unraid-ip:8889`
2. **Go to Backups tab**
3. **Find your backup** in the list
4. **Click "Restore"** button next to your backup
5. **Confirm the restore** - this will copy all templates back to `/boot/config/plugins/dockerMan/templates-user/`

This will repopulate your new Docker vDisk using saved templates.

---

## ✅ Verification

1. **Go to the Docker tab** in Unraid WebGUI
2. **Ensure all containers reappear** in the Docker interface
3. **Start each container** and test functionality
4. **Check Docker Template Manager** - all your templates should be listed in the Templates tab

---

## 🧹 Step 5: Cleanup (Optional)

Use Docker Template Manager to clean up after migration:

1. **Go to Templates tab**
2. **Review your templates** - remove any that are no longer needed
3. **Delete unused templates** using the individual delete buttons
4. **Verify all containers** are working correctly

---

## 💾 Backup Strategy

After migration, continue using Docker Template Manager for ongoing management:

- **Regular backups**: Use the **"Create Backup"** button in the Backups tab
- **Automatic backups**: Set up a cron job or use Unraid's built-in backup tools
- **vDisk snapshots**: Use Unraid's built-in snapshot features for the vDisk file

---

## 🧩 Troubleshooting

| Issue | Possible Fix |
|--------|----------------|
| Docker won't start | Check vDisk file path and permissions |
| Missing templates | Use Docker Template Manager to restore from backup |
| vDisk too small | Increase size: `truncate -s 50G /mnt/user/system/docker/docker.img` |
| Templates not showing | Check `/boot/config/plugins/dockerMan/templates-user/` directory |

---

## 🧰 Summary

| Action | Tool | Method |
|--------|------|----------|
| Backup templates | Docker Template Manager | Web interface → Backups → Create Backup |
| Stop Docker | Unraid GUI | Settings → Docker → Disable |
| Create vDisk | Terminal | `truncate -s 30G docker.img` |
| Configure Docker | Unraid GUI | Settings → Docker → Change data-root |
| Restore containers | Docker Template Manager | Web interface → Backups → Restore |

---

## 🔗 Related Features

- **Template Management**: View, edit, clone, and delete Docker templates
- **Container Control**: Start, stop, and restart containers
- **Backup & Restore**: Create and restore template backups
- **Professional UI**: Modern interface with theme toggle and mobile support

---

**Author:** Jos Visser ([@Qballjos](https://github.com/Qballjos))  
**Tool:** [Docker Template Manager](https://github.com/Qballjos/docker-template-manager)  
**License:** MIT  
**Version:** 1.4.0
