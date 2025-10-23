# Contributing to Docker Template Manager

Thank you for your interest in contributing to Docker Template Manager! This guide will help you get started with development and understand our contribution process.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## 🤝 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## 🚀 Getting Started

### Prerequisites

- **Docker** (for containerized development)
- **Python 3.11+** (for local development)
- **Node.js 18+** (for frontend development)
- **Git** (for version control)

### Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/docker-template-manager.git
   cd docker-template-manager
   ```
3. **Set up development environment** (see [Development Setup](#development-setup))

## 🛠️ Development Setup

### Option 1: Docker Development (Recommended)

```bash
# Clone the repository
git clone https://github.com/qballjos/docker-template-manager.git
cd docker-template-manager

# Start development environment
docker-compose -f docker-compose.local.yml up -d

# Access the application
open http://localhost:8889
```

### Option 2: Local Development

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
API_KEY=your-secure-api-key-here

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

## 📁 Project Structure

```
docker-template-manager/
├── .github/                    # GitHub workflows and templates
│   ├── workflows/             # CI/CD pipelines
│   ├── ISSUE_TEMPLATE/        # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/                      # Documentation
│   ├── api.md                 # API documentation
│   ├── unraid_vdisk_to_folder.md
│   └── unraid_folder_to_vdisk.md
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

## 🔄 Development Workflow

### 1. Create a Feature Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

### 2. Make Your Changes

- **Follow coding standards** (see [Coding Standards](#coding-standards))
- **Write tests** for new functionality
- **Update documentation** if needed
- **Test your changes** thoroughly

### 3. Commit Your Changes

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

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

### 4. Push and Create Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
# Use the provided PR template
```

## 📝 Coding Standards

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

// Good: Descriptive variable names
const isTemplateLoading = loading && selectedTemplate === null;
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

.template-editor__form-section--highlighted {
  background-color: var(--unraid-bg-highlight);
}
```

## 🧪 Testing

### Running Tests

```bash
# Python tests
python -m pytest tests/ -v

# Frontend tests (if available)
npm test

# Docker tests
docker build -t docker-template-manager:test .
docker run --rm -p 8889:8889 docker-template-manager:test
```

### Test Coverage

- **Aim for 80%+ test coverage**
- **Test both success and error cases**
- **Include integration tests**
- **Test API endpoints**

### Manual Testing Checklist

- [ ] **Templates section** - List, view, edit, delete templates
- [ ] **Containers section** - Start, stop, restart containers
- [ ] **Backups section** - Create, restore, delete backups
- [ ] **Theme toggle** - Dark/light mode switching
- [ ] **Mobile responsiveness** - Test on different screen sizes
- [ ] **API authentication** - Test with valid/invalid API keys

## 📤 Submitting Changes

### Pull Request Process

1. **Fill out the PR template** completely
2. **Link related issues** using `Fixes #123` or `Related to #456`
3. **Add screenshots** for UI changes
4. **Update documentation** if needed
5. **Ensure all checks pass**

### PR Requirements

- [ ] **Code follows style guidelines**
- [ ] **Tests pass** (if applicable)
- [ ] **Documentation updated**
- [ ] **No breaking changes** (or clearly documented)
- [ ] **Screenshots provided** for UI changes

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** on different environments
4. **Approval** from at least one maintainer

## 🚀 Release Process

### Version Numbering

We use [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0) - Breaking changes
- **MINOR** (1.1.0) - New features, backward compatible
- **PATCH** (1.1.1) - Bug fixes, backward compatible

### Creating a Release

1. **Update version** in `app.py`
2. **Update CHANGELOG.md** with new features/fixes
3. **Create a tag**:
   ```bash
   git tag v1.5.0
   git push origin v1.5.0
   ```
4. **GitHub Actions** will automatically:
   - Build Docker image
   - Publish to Docker Hub
   - Create GitHub release
   - Update documentation

## 🐛 Reporting Issues

### Before Reporting

- **Search existing issues** to avoid duplicates
- **Check the troubleshooting guide** in README
- **Test with latest version**

### Issue Template

Use the provided bug report template with:

- **Clear description** of the problem
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Environment details**
- **Screenshots/logs**

## 💡 Feature Requests

### Before Requesting

- **Check existing issues** for similar requests
- **Consider the project scope** and goals
- **Think about implementation complexity**

### Request Template

Use the provided feature request template with:

- **Clear description** of the feature
- **Use cases** and motivation
- **Technical considerations**
- **UI/UX mockups** (if applicable)

## 📚 Additional Resources

- **API Documentation**: [docs/api.md](docs/api.md)
- **Migration Guides**: [docs/](docs/)
- **Docker Setup**: [docker-compose.yml](docker-compose.yml)
- **Unraid Template**: [unraid-template.xml](unraid-template.xml)

## 🤔 Questions?

- **GitHub Discussions** - General questions and ideas
- **GitHub Issues** - Bug reports and feature requests
- **Pull Requests** - Code contributions

## 🙏 Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** page

Thank you for contributing to Docker Template Manager! 🎉
