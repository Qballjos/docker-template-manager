# Unraid vDisk → Folder Migration Guide (Using Docker Template Manager)

This guide explains how to migrate your Unraid Docker setup from **vDisk-based storage** to a **folder-based configuration** using the [Docker Template Manager](https://github.com/Qballjos/docker-template-manager) by Qballjos.

---

## 🧠 What’s the Difference?

| Type | Location Example | Description |
|------|------------------|--------------|
| **vDisk** | `/mnt/user/system/docker/docker.img` | A single virtual disk file storing all Docker data. Simpler but less flexible. |
| **Folder** | `/mnt/user/system/docker/` | A directory structure where each container’s data is stored individually. Easier to manage and recover. |

Migrating to folders improves **backup flexibility**, **container recovery**, and **debugging**.

---

## ⚙️ Step 1: Preparation

1. **Backup your templates** using **Docker Template Manager (DTM)**.
   ```bash
   dtm backup --all
   ```
   > This ensures all your current container configurations are safely stored in `/boot/config/plugins/dockerMan/templates-user/` and optionally a remote location.

2. **Stop Docker service:**
   ```bash
   /etc/rc.d/rc.docker stop
   ```

3. **Verify no containers are running**:
   ```bash
   docker ps
   ```
   Should return **no containers**.

---

## 📦 Step 2: Delete vDisk Image

1. Navigate to:
   ```
   Settings → Docker → Disable Docker Service
   ```

2. Delete or rename your old `docker.img` file (usually in `/mnt/user/system/docker/`).

   ```bash
   mv /mnt/user/system/docker/docker.img /mnt/user/system/docker/docker.img.backup
   ```

---

## 🗂 Step 3: Switch to Folder Mode

1. In the Unraid GUI, go to:
   ```
   Settings → Docker → Docker data-root
   ```
2. Change the setting from:
   ```
   /mnt/user/system/docker/docker.img
   ```
   to:
   ```
   /mnt/user/system/docker/
   ```
3. Enable **"Docker folder"** mode (available from Unraid 6.12+).  
   Then click **Apply**.

4. Re-enable the Docker service.

---

## 🚀 Step 4: Restore Containers with DTM

Once Docker is active in folder mode, use Docker Template Manager to restore all containers.

### Option 1: Restore All Containers
```bash
dtm restore --all
```

### Option 2: Selective Restore
```bash
dtm restore --select
```
Follow the on-screen prompts to choose which containers to restore.

---

## 🧹 Step 5: Cleanup (Optional)

You can remove unused or broken templates to keep your Unraid system clean:
```bash
dtm cleanup
```

---

## ✅ Verification

1. Open **Docker tab** in Unraid WebGUI.
2. Ensure all containers appear correctly.
3. Start them one by one and verify operation.

---

## 💾 Backup Strategy

After migration, DTM can automatically manage your templates:

- **Backup all templates periodically:**
  ```bash
  dtm backup --auto
  ```
- Store them in a remote or version-controlled location (e.g., `/mnt/user/backups/unraid-templates/`).

---

## 🧩 Troubleshooting

| Issue | Possible Fix |
|--------|----------------|
| Docker won’t start | Check folder path and permissions |
| Missing templates | Run `dtm restore` again |
| Wrong paths | Edit template `.xml` files manually in `/boot/config/plugins/dockerMan/templates-user/` |

---

## 🧰 Summary

| Action | Tool | Command |
|--------|------|----------|
| Backup templates | Docker Template Manager | `dtm backup --all` |
| Stop Docker | Unraid CLI | `/etc/rc.d/rc.docker stop` |
| Enable folder mode | Unraid GUI | Settings → Docker |
| Restore containers | Docker Template Manager | `dtm restore --all` |

---

**Author:** Jos Visser ([@Qballjos](https://github.com/Qballjos))  
**Tool:** [Docker Template Manager](https://github.com/Qballjos/docker-template-manager)  
**License:** MIT  
**Version:** 1.0.0
