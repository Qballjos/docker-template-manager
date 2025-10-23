# Unraid vDisk → Folder Migration Guide (Using Docker Template Manager)

This guide explains how to migrate your Unraid Docker setup from **vDisk-based storage** to a **folder-based configuration** using the [Docker Template Manager](https://github.com/Qballjos/docker-template-manager) web interface.

---

## 🧠 What's the Difference?

| Type | Location Example | Description |
|------|------------------|--------------|
| **vDisk** | `/mnt/user/system/docker/docker.img` | A single virtual disk file storing all Docker data. Simpler but less flexible. |
| **Folder** | `/mnt/user/system/docker/` | A directory structure where each container's data is stored individually. Easier to manage and recover. |

Migrating to folders improves **backup flexibility**, **container recovery**, and **debugging**.

---

## ⚙️ Step 1: Preparation

1. **Access Docker Template Manager** at `http://your-unraid-ip:8889`
2. **Create a backup** using the web interface:
   - Go to **Backups** tab
   - Click **"Create Backup"** button
   - This saves all your current Docker templates to `/mnt/user/appdata/docker-template-manager/backups/`

3. **Stop Docker service** in Unraid:
   - Go to **Settings → Docker**
   - Set **Enable Docker** to **No**
   - Click **Apply**

4. **Verify no containers are running**:
   ```bash
   docker ps
   ```
   Should return **no containers**.

---

## 📦 Step 2: Delete vDisk Image

1. **Navigate to Docker settings**:
   ```
   Settings → Docker → Disable Docker Service
   ```

2. **Delete or rename your old `docker.img` file**:
   ```bash
   mv /mnt/user/system/docker/docker.img /mnt/user/system/docker/docker.img.backup
   ```

---

## 🗂 Step 3: Switch to Folder Mode

1. **In the Unraid GUI, go to**:
   ```
   Settings → Docker → Docker data-root
   ```

2. **Change the setting from**:
   ```
   /mnt/user/system/docker/docker.img
   ```
   **to**:
   ```
   /mnt/user/system/docker/
   ```

3. **Enable "Docker folder" mode** (available from Unraid 6.12+)
4. **Click Apply**
5. **Re-enable the Docker service**

---

## 🚀 Step 4: Restore Containers with DTM

Once Docker is active in folder mode, use Docker Template Manager to restore all containers:

1. **Access Docker Template Manager** at `http://your-unraid-ip:8889`
2. **Go to Backups tab**
3. **Find your backup** in the list
4. **Click "Restore"** button next to your backup
5. **Confirm the restore** - this will copy all templates back to `/boot/config/plugins/dockerMan/templates-user/`

---

## 🧹 Step 5: Cleanup (Optional)

Use Docker Template Manager to clean up unused templates:

1. **Go to Templates tab**
2. **Review your templates** - look for any that are no longer needed
3. **Delete unused templates** using the individual delete buttons
4. **Or use the cleanup feature** (if available in future versions)

---

## ✅ Verification

1. **Open Docker tab** in Unraid WebGUI
2. **Ensure all containers appear** correctly in the Docker interface
3. **Start them one by one** and verify operation
4. **Check Docker Template Manager** - all your templates should be listed in the Templates tab

---

## 💾 Backup Strategy

After migration, use Docker Template Manager for ongoing template management:

- **Regular backups**: Use the **"Create Backup"** button in the Backups tab
- **Automatic backups**: Set up a cron job or use Unraid's built-in backup tools
- **Remote storage**: Copy backups to external storage or cloud services

---

## 🧩 Troubleshooting

| Issue | Possible Fix |
|--------|----------------|
| Docker won't start | Check folder path and permissions in Settings → Docker |
| Missing templates | Use Docker Template Manager to restore from backup |
| Templates not showing | Check `/boot/config/plugins/dockerMan/templates-user/` directory permissions |
| Web interface not loading | Verify Docker Template Manager container is running |

---

## 🧰 Summary

| Action | Tool | Method |
|--------|------|----------|
| Backup templates | Docker Template Manager | Web interface → Backups → Create Backup |
| Stop Docker | Unraid GUI | Settings → Docker → Disable |
| Enable folder mode | Unraid GUI | Settings → Docker → Change data-root |
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
