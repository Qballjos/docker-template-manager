# Security Policy

## Supported Versions

We actively maintain security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.4.x   | :white_check_mark: |
| 1.3.x   | :white_check_mark: |
| < 1.3   | :x:                |

## Security Features

### 🔒 Built-in Security Measures

- **API Key Authentication** - Secure access control
- **CORS Protection** - Cross-origin request security
- **Input Validation** - Sanitized user inputs
- **Secure File Operations** - Safe path handling
- **Non-root Docker User** - Container security
- **Regular Security Scans** - Automated vulnerability detection

### 🛡️ Security Best Practices

- **Dependency Updates** - Automated weekly updates
- **Vulnerability Scanning** - Trivy security scans
- **Code Quality Checks** - Automated security reviews
- **Docker Security** - Multi-stage builds, non-root user
- **Environment Isolation** - Secure configuration

## Reporting a Vulnerability

### 🚨 How to Report

If you discover a security vulnerability, please report it responsibly:

1. **DO NOT** create a public GitHub issue
2. **DO NOT** discuss the vulnerability publicly
3. **DO** report privately to: security@yourdomain.com
4. **DO** include detailed information about the vulnerability

### 📋 What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Suggested remediation (if any)
- Your contact information

### ⏱️ Response Timeline

- **Initial Response**: Within 24 hours
- **Status Update**: Within 72 hours
- **Resolution**: Within 7 days (for critical issues)

## Security Updates

### 🔄 Automatic Updates

- **Dependencies**: Updated weekly via Dependabot
- **Base Images**: Updated weekly via security scans
- **Security Patches**: Applied immediately for critical issues
- **Minor Updates**: Applied within 48 hours

### 📊 Security Monitoring

- **Daily Scans**: Automated vulnerability detection
- **Weekly Reports**: Security status updates
- **Monthly Reviews**: Comprehensive security assessment
- **Quarterly Audits**: Full security evaluation

## Security Configuration

### 🔧 Environment Variables

```bash
# Required for security
API_KEY=your-secure-api-key-here
ALLOWED_ORIGINS=http://localhost:8889,http://your-domain.com

# Optional security enhancements
FLASK_DEBUG=false
TZ=UTC
```

### 🐳 Docker Security

```yaml
# docker-compose.yml security example
version: '3.8'
services:
  docker-template-manager:
    image: qballjos/docker-template-manager:latest
    ports:
      - "8889:8889"
    environment:
      - API_KEY=${API_KEY}
      - ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    restart: unless-stopped
    # Security: Run as non-root user
    user: "1000:1000"
```

## Security Checklist

### ✅ Before Deployment

- [ ] API key is set and secure
- [ ] CORS origins are properly configured
- [ ] Docker container runs as non-root user
- [ ] All dependencies are up to date
- [ ] Security scans pass without critical issues
- [ ] Environment variables are properly set
- [ ] File permissions are correct
- [ ] Network access is restricted

### 🔍 Regular Security Checks

- [ ] Weekly dependency updates
- [ ] Monthly security scans
- [ ] Quarterly security reviews
- [ ] Annual penetration testing
- [ ] Continuous monitoring
- [ ] Incident response planning

## Contact

For security-related questions or concerns:

- **Email**: security@yourdomain.com
- **GitHub**: Create a private security advisory
- **Response Time**: 24 hours for initial response

## Acknowledgments

We appreciate the security research community and responsible disclosure practices. Thank you for helping keep our users safe.
