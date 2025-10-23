# Development Guide

This guide will help you set up a development environment for Docker Template Manager and understand the codebase structure.

## 🛠️ Development Setup

### Prerequisites

- **Docker** and **Docker Compose**
- **Python 3.11+** (for local development)
- **Node.js 18+** (for frontend development)
- **Git** (for version control)

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/qballjos/docker-template-manager.git
   cd docker-template-manager
   ```

2. **Start development environment:**
   ```bash
   # Using Docker (Recommended)
   docker-compose -f docker-compose.local.yml up -d --build
   
   # Or local development
   pip install -r requirements.txt
   python app.py
   ```

3. **Access the application:**
   - Open http://localhost:8889
   - API Key: `docker-template-manager-2024-secure-key-12345` (default)

## 🎨 Latest UI/UX Improvements (v1.4.3)

### Enhanced User Experience
- **🎨 Improved Form Styling** - Fixed white background with white text issues in form fields
- **🎯 Better Button Colors** - Replaced bright orange selection buttons with subtle grey colors
- **⌨️ Fixed Input Focus** - Form fields now maintain focus while typing (no more deselection)
- **📜 Single Scrollbar** - Eliminated double scrollbars in the template editor
- **👁️ Enhanced Readability** - Improved text contrast and visibility throughout the interface

### Technical Improvements
- **CSS Architecture** - Replaced inline styles with proper CSS classes using theme variables
- **JavaScript Optimization** - Fixed variable name conflicts in form handlers
- **Theme Consistency** - All UI elements now use consistent theme colors
- **Accessibility** - Better color contrast and form field accessibility
- **Performance** - Optimized form rendering and reduced unnecessary re-renders

## 📁 Project Structure

```
docker-template-manager/
├── .github/                    # GitHub workflows and templates
│   ├── workflows/             # CI/CD pipelines
│   ├── ISSUE_TEMPLATE/        # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/                      # Documentation and website
│   ├── index.html             # GitHub Pages website
│   ├── api.md                 # API documentation
│   └── migration guides
├── static/                   # Frontend assets
│   ├── app.jsx                # Main React application
│   ├── app.js                  # Compiled JavaScript
│   ├── app.css                # Styles
│   ├── index.html             # Main HTML template
│   └── png/                    # Images and icons
├── app.py                      # Flask backend
├── requirements.txt            # Python dependencies
├── package.json                # Node.js dependencies
├── docker-compose.yml          # Production Docker setup
├── docker-compose.local.yml   # Development Docker setup
├── dockerfile                  # Docker image definition
├── unraid-template.xml         # Unraid Community Apps template
└── README.md                   # Project documentation
```

## 🔧 Development Environment

### Docker Development (Recommended)

```bash
# Start development environment
docker-compose -f docker-compose.local.yml up -d

# View logs
docker-compose -f docker-compose.local.yml logs -f

# Stop environment
docker-compose -f docker-compose.local.yml down
```

### Local Development

```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies (if modifying frontend)
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your settings

# Run the application
python app.py
```

### Environment Variables

Create a `.env` file with the following variables:

```env
# API Security
API_KEY=docker-template-manager-2024-secure-key-12345

# CORS Settings
ALLOWED_ORIGINS=http://localhost:8889,http://localhost:5173

# Timezone
TZ=Europe/Amsterdam

# Debug Mode
FLASK_DEBUG=true

# Directory Paths (for local development)
TEMPLATE_DIR=./local-data/templates
BACKUP_DIR=./local-data/backups
CONFIG_DIR=./local-data/config

# Backup Settings
BACKUP_RETENTION_DAYS=30
AUTO_CLEANUP_ENABLED=false
```

## 🎨 Frontend Development

### React Application Structure

The frontend is built with React using `React.createElement` (no JSX compilation needed):

- **`static/app.jsx`** - Main React application
- **`static/app.js`** - Compiled version (auto-synced)
- **`static/app.css`** - Styles and theming
- **`static/index.html`** - HTML template

### Key Components

- **Dashboard** - Statistics and overview
- **Templates** - Template management with hybrid editor
- **Containers** - Container management and controls
- **Backups** - Backup creation and restoration
- **Theme System** - Dark/light mode support

### Development Workflow

1. **Edit `static/app.jsx`** for React components
2. **Copy to `static/app.js`** for production
3. **Update cache-busting** in `static/index.html`
4. **Test in browser** with hard refresh

```bash
# Sync changes
cp static/app.jsx static/app.js

# Update cache-busting
# Edit static/index.html and increment ?v= parameter
```

### Styling

- **CSS Custom Properties** for theming
- **BEM Methodology** for class naming
- **Mobile-first** responsive design
- **Dark/Light theme** support

## 🐍 Backend Development

### Flask Application Structure

- **`app.py`** - Main Flask application
- **API Routes** - RESTful endpoints
- **Authentication** - API key validation
- **Docker Integration** - Container management
- **File Operations** - Template and backup handling

### Key Features

- **RESTful API** with proper HTTP methods
- **Authentication** via API keys
- **CORS Support** for cross-origin requests
- **Error Handling** with proper HTTP status codes
- **Security** with input validation and sanitization

### API Endpoints

```
GET  /api/health          # Health check
GET  /api/version         # Version information
GET  /api/check-updates   # Update checking
GET  /api/stats           # Statistics
GET  /api/templates       # List templates
POST /api/templates       # Create template
GET  /api/containers      # List containers
POST /api/containers/:id/:action  # Container actions
GET  /api/backups         # List backups
POST /api/backups         # Create backup
```

## 🧪 Testing

### Running Tests

```bash
# Python tests (if available)
python -m pytest tests/ -v

# Frontend tests (if available)
npm test

# Docker tests
docker build -t docker-template-manager:test .
docker run --rm -p 8889:8889 docker-template-manager:test
```

### Manual Testing Checklist

- [ ] **Templates section** - List, view, edit, delete templates
- [ ] **Containers section** - Start, stop, restart containers
- [ ] **Backups section** - Create, restore, delete backups
- [ ] **Theme toggle** - Dark/light mode switching
- [ ] **Mobile responsiveness** - Test on different screen sizes
- [ ] **API authentication** - Test with valid/invalid API keys

## 🧪 Local Development Testing

### Development Environment Setup

```bash
# Start local development with test templates
docker-compose -f docker-compose.local.yml up -d --build

# Access the application
open http://localhost:8889
```

### Test Templates

The local environment includes test templates for development:

- **Location**: `/app/templates/` inside the container
- **Test Template**: `test-template.xml` with sample configuration
- **Purpose**: Testing template parsing, form population, and editor functionality

### UI/UX Testing Checklist

#### Form Functionality
- [ ] **Input Focus** - Form fields maintain focus while typing (no deselection)
- [ ] **Text Readability** - All text is clearly visible with proper contrast
- [ ] **Form Styling** - No white background with white text issues
- [ ] **Button Colors** - Selection buttons use subtle grey colors (not bright orange)
- [ ] **Scrollbars** - Only one scrollbar appears in the editor (no double scrollbars)

#### Template Editor Testing
- [ ] **XML Parsing** - XML values load correctly into form fields
- [ ] **Mode Switching** - Form ↔ XML mode switching works
- [ ] **Save Functionality** - Template saving works correctly
- [ ] **Form Population** - All fields populate with correct values
- [ ] **Input Validation** - Form validation works as expected

#### Theme Consistency
- [ ] **Dark Mode** - All elements use proper dark theme colors
- [ ] **Light Mode** - All elements use proper light theme colors
- [ ] **Theme Toggle** - Switching between themes works correctly
- [ ] **Color Contrast** - All text has sufficient contrast for readability

### Development Commands

```bash
# Rebuild container with latest changes
docker-compose -f docker-compose.local.yml up -d --build

# View application logs
docker-compose -f docker-compose.local.yml logs -f

# Stop local development
docker-compose -f docker-compose.local.yml down

# Access container shell for debugging
docker exec -it docker-template-manager-local /bin/bash

# Check container status
docker ps | grep docker-template-manager-local

# View container logs
docker logs docker-template-manager-local
```

### API Testing

```bash
# Test API endpoints
curl -s http://localhost:8889/api/version
curl -s http://localhost:8889/api/templates
curl -s http://localhost:8889/api/containers

# Test with authentication (replace with your API key)
curl -H "X-API-Key: your-api-key" http://localhost:8889/api/templates
```

### File Operations Testing

```bash
# Copy test files to container
docker cp local-file.txt docker-template-manager-local:/app/templates/

# Copy files from container
docker cp docker-template-manager-local:/app/templates/test-template.xml ./local-test.xml

# Check container file system
docker exec docker-template-manager-local find /app -name "*.xml"

# Check file permissions
docker exec docker-template-manager-local ls -la /app/templates/
```

### Troubleshooting Local Development

#### Common Issues

**Container Won't Start**
```bash
# Check if port is already in use
lsof -i :8889

# Kill process using the port
sudo kill -9 $(lsof -t -i:8889)

# Restart container
docker-compose -f docker-compose.local.yml up -d
```

**Template Not Showing**
```bash
# Check template permissions
docker exec docker-template-manager-local ls -la /app/templates/

# Fix permissions if needed
docker exec -u root docker-template-manager-local chown appuser:appuser /app/templates/test-template.xml
```

**API Key Issues**
```bash
# Check if API key is set
docker exec docker-template-manager-local env | grep API_KEY

# View application logs for API key
docker logs docker-template-manager-local | grep -i "api"
```

**File Permission Issues**
```bash
# Check container user
docker exec docker-template-manager-local whoami

# Fix ownership
docker exec -u root docker-template-manager-local chown -R appuser:appuser /app/templates/
```

## 🚀 Building and Deployment

### Docker Build

```bash
# Build Docker image
docker build -t docker-template-manager:latest .

# Run locally
docker run -p 8889:8889 docker-template-manager:latest
```

### Production Deployment

```bash
# Using Docker Compose
docker-compose up -d

# Using Docker Run
docker run -d \
  --name docker-template-manager \
  -p 8889:8889 \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -v /path/to/templates:/templates:rw \
  -v /path/to/backups:/backups:rw \
  -e API_KEY=your-secure-api-key \
  qballjos/docker-template-manager:latest
```

## 📝 Code Standards

### Python (Backend)

- **Follow PEP 8** style guidelines
- **Use type hints** where appropriate
- **Write docstrings** for functions and classes
- **Use meaningful variable names**

```python
def get_template_info(template_path: str) -> dict:
    """
    Retrieve template information from file path.
    
    Args:
        template_path: Path to the template file
        
    Returns:
        Dictionary containing template metadata
    """
    # Implementation here
```

### JavaScript (Frontend)

- **Use modern ES6+** syntax
- **Follow React best practices**
- **Use meaningful component and variable names**
- **Add comments for complex logic**

```javascript
// Good: Clear function name and purpose
const handleTemplateSelection = (templateId) => {
  setSelectedTemplate(templateId);
  fetchTemplateDetails(templateId);
};
```

### CSS

- **Use CSS custom properties** for theming
- **Follow BEM methodology** for class naming
- **Use semantic class names**

```css
/* Good: Semantic and descriptive */
.template-editor__form-section {
  margin-bottom: 1rem;
}
```

## 🔄 Git Workflow

### Branch Naming

- **`feature/description`** - New features
- **`fix/description`** - Bug fixes
- **`docs/description`** - Documentation updates
- **`refactor/description`** - Code refactoring

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Feature
git commit -m "feat: add new template editor functionality"

# Bug fix
git commit -m "fix: resolve template loading issue"

# Documentation
git commit -m "docs: update API documentation"

# Breaking change
git commit -m "feat!: redesign template editor interface"
```

### Pull Request Process

1. **Create feature branch** from `main`
2. **Make changes** following coding standards
3. **Test thoroughly** with manual testing checklist
4. **Create pull request** using the template
5. **Address review feedback**
6. **Merge after approval**

## 🐛 Debugging

### Common Issues

1. **API Key Issues**
   - Check environment variables
   - Verify API key in browser storage
   - Check CORS settings

2. **Docker Connection Issues**
   - Verify Docker socket permissions
   - Check Docker daemon status
   - Test with `docker ps`

3. **File Permission Issues**
   - Check volume mount permissions
   - Verify directory ownership
   - Test file operations

### Debug Tools

```bash
# Check Docker logs
docker logs docker-template-manager

# Check file permissions
ls -la /path/to/templates

# Test API endpoints
curl -H "X-API-Key: your-key" http://localhost:8889/api/health
```

## 📚 Additional Resources

- **API Documentation**: [docs/api.md](docs/api.md)
- **Contributing Guide**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Code of Conduct**: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- **GitHub Repository**: https://github.com/qballjos/docker-template-manager

## 🤔 Getting Help

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Pull Requests** - Code contributions

Happy coding! 🚀
