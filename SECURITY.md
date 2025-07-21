# Security Policy

## Supported Versions

We actively maintain security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability in SynAI, please report it responsibly.

### How to Report

1. **Email**: Send details to hello@sashank.wiki
2. **Subject**: Include "SynAI Security" in the subject line
3. **Details**: Provide a detailed description of the vulnerability

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

### Response Process

- **Acknowledgment**: Within 24 hours
- **Initial Response**: Within 72 hours
- **Resolution**: Depends on severity and complexity

## Security Best Practices

When using SynAI:

1. **API Keys**: Never commit API keys to version control
2. **Environment Variables**: Use environment variables for sensitive data
3. **Updates**: Keep dependencies updated regularly
4. **HTTPS**: Always use HTTPS in production

## Security Features

- Client-side encryption of API keys
- No data sent to external servers except AI providers
- Secure local storage implementation
- Input sanitization and validation