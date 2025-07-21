# Security Policy

## Supported Versions

We actively support the latest version of SynAI. Security updates are applied to:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest| :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please follow responsible disclosure:

**DO NOT** open a public issue for security vulnerabilities.

Instead:

1. **Email**: Send details to hello@sashank.wiki with subject "SynAI Security Issue"
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Response Timeline

- **Initial Response**: Within 48 hours
- **Investigation**: Within 1 week
- **Fix & Release**: Within 2 weeks (depending on severity)

## Security Considerations

SynAI handles sensitive data including:
- API keys (stored locally in browser)
- User conversations
- Uploaded files

### Built-in Protections

- API keys stored only in browser localStorage
- No server-side storage of user data
- All communication with AI providers uses HTTPS
- No telemetry or data collection

### Best Practices for Users

- Keep API keys secure and don't share them
- Use environment variables for API keys in production
- Regularly rotate API keys
- Be cautious with sensitive information in conversations
- Clear browser data when using shared computers

## Third-Party Dependencies

We regularly update dependencies and monitor for security advisories. See `package.json` for current versions.

## Questions?

For security questions (non-vulnerability), open a discussion in the repository.