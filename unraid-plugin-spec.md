# Unraid Plugin: Docker Template Manager

## Plugin Structure

```
docker-template-manager/
├── docker-template-manager.plg          # Plugin manifest
├── usr/local/emhttp/plugins/docker-template-manager/
│   ├── DockerTemplateManager.page       # Main page definition
│   ├── DockerTemplateManager.php        # Backend logic
│   ├── scripts/
│   │   ├── cleanup-templates.sh         # Your cleanup script
│   │   ├── backup-containers.sh         # Your backup script
│   │   └── api.php                      # AJAX endpoints
│   ├── styles/
│   │   └── docker-template-manager.css
│   └── images/
│       └── icon.png
└── README.md
```

## Features

### 1. Template Cleanup Tab
- **Visual Template List**: Show all templates with color coding
  - ✅ Green: Template has matching container
  - ⚠️ Yellow: Template might match (fuzzy match)
  - ❌ Red: No matching container (candidate for removal)
- **Bulk Actions**: 
  - Select multiple unused templates
  - Preview before deletion
  - One-click backup before removal
- **Search/Filter**: Find templates quickly
- **Last Used Date**: Track when containers were last active

### 2. Backup & Migration Tab
- **Pre-Migration Checklist**:
  - Disk space check
  - Template validation
  - Container health status
- **Backup Manager**:
  - List all backups with timestamps
  - Restore from backup
  - Download backups
  - Auto-cleanup old backups
- **Migration Wizard**:
  - Step-by-step guide for vdisk → folder migration
  - Progress tracking
  - Rollback capability

### 3. Container Recreation Tab
- **Smart Recreation**:
  - Show dependency order (databases first)
  - One-click recreation from template
  - Batch recreation with progress bar
- **Template-Container Mapping**:
  - Visual diagram of relationships
  - Highlight mismatches
  - Suggest fixes

### 4. Settings Tab
- **Automation Options**:
  - Schedule automatic cleanup checks
  - Auto-backup before Docker updates
  - Email notifications
- **Matching Rules**:
  - Configure prefix patterns (my-, wp-, etc.)
  - Case sensitivity options
  - Custom matching rules
- **Backup Settings**:
  - Backup location
  - Retention policy
  - Compression options

## Technical Implementation

### Plugin Manifest (.plg file)
```xml
<?xml version='1.0' standalone='yes'?>
<!DOCTYPE PLUGIN [
<!ENTITY name      "docker-template-manager">
<!ENTITY author    "YourName">
<!ENTITY version   "2024.10.13">
<!ENTITY launch    "Settings/DockerTemplateManager">
<!ENTITY pluginURL "https://raw.githubusercontent.com/yourusername/unraid-docker-template-manager/master/docker-template-manager.plg">
]>

<PLUGIN name="&name;" author="&author;" version="&version;" launch="&launch;" pluginURL="&pluginURL;">

<CHANGES>
###2024.10.13
- Initial release
- Template cleanup functionality
- Backup and migration tools
- Container recreation wizard
</CHANGES>

<!-- Install/update plugin -->
<FILE Run="/bin/bash">
<INLINE>
# Download plugin files
mkdir -p /usr/local/emhttp/plugins/docker-template-manager
# ... installation logic
</INLINE>
</FILE>

<!-- Remove plugin -->
<FILE Run="/bin/bash" Method="remove">
<INLINE>
rm -rf /usr/local/emhttp/plugins/docker-template-manager
</INLINE>
</FILE>

</PLUGIN>
```

### Page Definition (DockerTemplateManager.page)
```
Menu="DockerSettings"
Title="Template Manager"
Icon="docker-template-manager.png"
---
```

### Backend API Endpoints (api.php)

```php
<?php
// GET /plugins/docker-template-manager/scripts/api.php?action=list_templates
// GET /plugins/docker-template-manager/scripts/api.php?action=list_containers
// POST /plugins/docker-template-manager/scripts/api.php?action=cleanup_templates
// POST /plugins/docker-template-manager/scripts/api.php?action=backup_containers
// GET /plugins/docker-template-manager/scripts/api.php?action=list_backups
?>
```

## UI Mockup (Key Features)

### Dashboard Overview
```
╔══════════════════════════════════════════════════════════════╗
║ Docker Template Manager                            [Settings] ║
╠══════════════════════════════════════════════════════════════╣
║                                                                ║
║  📊 Quick Stats                                                ║
║  ┌────────────┬────────────┬────────────┬────────────┐       ║
║  │ Templates  │ Containers │   Unused   │  Backups   │       ║
║  │    124     │     48     │     76     │     3      │       ║
║  └────────────┴────────────┴────────────┴────────────┘       ║
║                                                                ║
║  ⚠️ 76 unused templates detected                              ║
║     [Scan Now] [Clean Up Unused]                              ║
║                                                                ║
╚══════════════════════════════════════════════════════════════╝
```

### Template List View
```
╔══════════════════════════════════════════════════════════════╗
║ Template Cleanup                            [☑️ Select All]   ║
╠══════════════════════════════════════════════════════════════╣
║ Search: [____________]  Filter: [All ▼] [Used] [Unused]      ║
║                                                                ║
║ ☑️ ✅ my-plex.xml              Container: plex      [View]    ║
║ ☑️ ✅ my-jellyfin.xml          Container: jellyfin  [View]    ║
║ ☑️ ❌ my-old-app.xml           No container         [View]    ║
║ ☑️ ❌ my-unused-service.xml    No container         [View]    ║
║                                                                ║
║ [Backup Selected] [Remove Selected] [Export List]             ║
╚══════════════════════════════════════════════════════════════╝
```

## Installation for Users

1. Go to **Plugins** tab in Unraid
2. Click **Install Plugin**
3. Paste plugin URL
4. Click **Install**
5. Find new **Template Manager** under **Settings → Docker**

## Distribution

- Host on GitHub
- Submit to Community Applications
- Provide documentation on Unraid Forums
- Regular updates via plugin system

## Advantages Over Scripts

1. **User-Friendly**: No terminal needed
2. **Visual Feedback**: See exactly what will happen
3. **Safety**: Built-in confirmations and dry-run modes
4. **Integrated**: Native Unraid UI experience
5. **Automatic Updates**: Plugin system handles updates
6. **Scheduling**: Built-in cron integration
7. **Logging**: Centralized log viewer
8. **Notifications**: Unraid notification system integration
