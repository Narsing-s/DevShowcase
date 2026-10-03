# Security Policy

## Reporting a vulnerability

Please do not open a public issue for a security vulnerability.

Report security issues privately through GitHub's private vulnerability reporting when available. Include the affected file or URL, reproduction steps, impact, and a suggested fix if known.

Never include passwords, tokens, database credentials, or other secrets.

## Deployment security

Keep DATABASE_URL, SESSION_SECRET, GITHUB_CLIENT_SECRET, and DB_INIT_SECRET server-side. Use HTTPS in production and rotate credentials if they are accidentally exposed.
