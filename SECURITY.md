# Security Guide

## 🔒 What's Protected

Version 1.1.0 fixes all 11 security vulnerabilities:

- ✅ API key authentication required
- ✅ Path traversal attacks blocked
- ✅ All inputs validated
- ✅ Security headers enabled
- ✅ CORS restricted
- ✅ Dependencies updated
- ✅ Error messages sanitized

---

## 🔑 API Key

**Your API key is like a password - keep it private!**

### Find Your Key
Docker → Container icon → Logs → Look for:
```
Generated temporary key: xxxxx
```

### Generate Custom Key
```bash
openssl rand -base64 32
```
Add to container's `API_KEY` environment variable.

---

## 🛡️ Best Practices

1. **Never share your API key**
2. **Don't expose port 8080 to internet** - Local network only
3. **Use VPN for remote access**
4. **Update container regularly**
5. **Check logs periodically**

---

## 🆘 Issues

**"401 Unauthorized"**
- API key missing or wrong
- Check Docker logs for key

**Lost API Key**
1. Check Docker logs first
2. Or: Stop → Clear `API_KEY` → Start → New key in logs

---

## 🐛 Report Security Issues

**Do NOT open public GitHub issues!**

Email maintainer directly or create private security advisory on GitHub.

---

## ✅ Security Checklist

- [ ] API key saved securely
- [ ] `FLASK_DEBUG` is false
- [ ] Not exposed to internet
- [ ] Container updated
- [ ] Logs monitored

---

For more details, see [CHANGELOG.md](CHANGELOG.md)
