# Unraid Folder → vDisk Migration Guide (Using Docker Template Manager)

This guide explains how to migrate your Unraid Docker setup from **folder-based storage** back to a **vDisk-based setup**, again using the [Docker Template Manager](https://github.com/Qballjos/docker-template-manager).

---

## 🧠 Why Switch Back?

While folder mode offers flexibility, vDisk can be:
- Easier to manage for beginners.
- Simpler for snapshot-based backups.
- Useful for systems with limited shares or SMB exposure.

---

## ⚙️ Step 1: Backup Templates

Before making any changes, backup all Docker templates:

```bash
dtm backup --all
```

---

## 🧱 Step 2: Stop Docker Service

In the Unraid web interface:
1. Go to `Settings → Docker`
2. Set **Enable Docker** to **No**
3. Click **Apply**

Or via terminal:
```bash
/etc/rc.d/rc.docker stop
```

---

## 🧹 Step 3: Prepare vDisk

1. Create a new vDisk file (e.g., `docker.img`):
   ```bash
   mkdir -p /mnt/user/system/docker/
   truncate -s 30G /mnt/user/system/docker/docker.img
   ```

   > Adjust size (`30G`) to your needs.

2. Go to **Settings → Docker → Docker data-root** and set:
   ```
   /mnt/user/system/docker/docker.img
   ```

3. Enable Docker and click **Apply**.

---

## 🚀 Step 4: Restore Containers

Use Docker Template Manager to restore all containers from the backup:

```bash
dtm restore --all
```

This will repopulate your new Docker vDisk using saved templates.

---

## ✅ Verification

1. Go to the **Docker** tab in Unraid.
2. Ensure all containers reappear.
3. Start each container and test functionality.

---

## 🧩 Summary

| Action | Tool | Command |
|--------|------|----------|
| Backup templates | Docker Template Manager | `dtm backup --all` |
| Stop Docker | Unraid CLI | `/etc/rc.d/rc.docker stop` |
| Create vDisk | Terminal | `truncate -s 30G docker.img` |
| Restore containers | Docker Template Manager | `dtm restore --all` |

---

**Author:** Jos Visser ([@Qballjos](https://github.com/Qballjos))  
**Tool:** [Docker Template Manager](https://github.com/Qballjos/docker-template-manager)  
**License:** MIT  
**Version:** 1.0.0
