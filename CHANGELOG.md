# Changelog

## [1.2.0] - 2025-10-21

### 🎉 New Features

**Search & Filter:**
- Real-time template search by name or container
- Filter by status: All/Matched/Unused
- Sort by: Name, Size, or Date Modified
- Shows filtered count (e.g., "5/20 templates")
- Clear search button

**Dashboard Enhancements:**
- Pie chart visualization for template status
- Visual breakdown of matched vs unused templates
- Color-coded legend with percentages
- Responsive chart design

**UI Improvements:**
- Logo and favicon added
- Version number updated to v1.2.0
- Better mobile responsiveness
- Improved filter bar design

### Added
- Search functionality in templates tab
- Filter dropdown for template status
- Sort dropdown for template ordering
- SVG pie chart component
- Logo (png/logo.png)
- Favicon (png/favicon.png)

### Changed
- Footer version: 1.0 → 1.2.0
- Updated README with v1.2.0 features
- Improved templates page layout
- Enhanced dashboard visual appeal

---

## [1.1.0] - 2025-10-19

### 🔒 Security Update - All 11 Vulnerabilities Fixed

- ✅ API key authentication required
- ✅ Path traversal protection
- ✅ Input validation
- ✅ Security headers
- ✅ CORS restrictions
- ✅ Updated all dependencies
- ✅ Error sanitization

### 📦 Dependencies Updated

- Flask: 3.0.0 → 3.1.0
- flask-cors: 4.0.0 → 5.0.0
- docker: 7.0.0 → 7.1.0
- requests: 2.31.0 → 2.32.3
- gunicorn: 21.2.0 → 23.0.0
- vite: 4.4.0 → 5.4.11
- React: 18.2.0 → 18.3.1

### ⬆️ Upgrading from 1.0.0

1. Update container
2. Check logs for API key
3. Save your key
4. Access WebUI with key

**No data loss - templates and backups preserved!**

---

## [1.0.0] - Initial Release

- Dashboard with stats
- Template management
- Smart container matching
- Template cleanup
- One-click backups
- Backup restore
- Container monitoring
- Modern web UI
