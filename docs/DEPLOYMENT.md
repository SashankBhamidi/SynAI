# Deployment Guide

## Overview

SynAI uses a robust CI/CD pipeline with GitHub Actions for automated testing and deployment to Vercel. This guide covers the deployment process, configuration, and troubleshooting.

## Deployment Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Development   │    │   GitHub Actions │    │   Production    │
│                 │    │                  │    │                 │
│ • Local testing │────│ • Quality Gate   │────│ • Vercel Hosting│
│ • Feature branch│    │ • Security Scan  │    │ • CDN Distribution│
│ • Pull requests │    │ • Build & Deploy │    │ • HTTPS/SSL     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Environments

### Production Environment
- **URL**: https://synai.site
- **Hosting**: Vercel
- **Branch**: `master` only
- **Deployment**: Automated via GitHub Actions
- **Approval**: Manual approval required

### Development Environment
- **URL**: Local development server
- **Command**: `npm run dev`
- **Port**: 5173 (default Vite port)
- **Hot Reload**: Enabled

## Prerequisites

### Required Secrets

Configure these in GitHub repository settings (`Settings > Secrets and variables > Actions`):

```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_organization_id  
VERCEL_PROJECT_ID=your_project_id
```

### Optional Secrets

All required secrets are free services. No additional paid service tokens needed.

## Deployment Process

### Automatic Deployment (Production)

1. **Trigger**: Push to `master` branch
2. **Quality Gate**: All tests must pass
3. **Manual Approval**: Required for production deployment
4. **Deployment**: GitHub Actions deploys to Vercel
5. **Verification**: Automatic health checks

### Manual Deployment Process

For emergency deployments or troubleshooting:

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Link project (first time only)
vercel link

# 4. Deploy to production
vercel --prod
```

## CI/CD Pipeline

### Quality Gate Workflow

```yaml
# Triggered on: PR creation, push to master
Jobs:
  1. Test Suite (Node 18 & 20)
  2. Security Scanning  
  3. Dependency Review
  4. Quality Gate Check
```

**Requirements for Passing:**
- ✅ All unit tests pass (100%)
- ✅ Code coverage ≥ 70%
- ✅ TypeScript compilation succeeds
- ✅ ESLint rules pass
- ✅ Security scan passes
- ✅ Build completes successfully

### Production Deploy Workflow

```yaml
# Triggered on: Push to master (after quality gate)
Jobs:
  1. Quality Gate (must pass)
  2. Manual Approval (required)
  3. Build for Production
  4. Deploy to Vercel
  5. Post-deployment Verification
```

## Build Configuration

### Vite Build Settings

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: false, // Disabled for production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-button']
        }
      }
    }
  }
})
```

### Environment Variables

For build-time configuration:

```bash
# .env.production
VITE_APP_NAME=SynAI
VITE_APP_VERSION=$npm_package_version
VITE_BUILD_TIME=$BUILD_TIME
```

## Vercel Configuration

### Project Settings

```json
{
  "name": "synai",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "devCommand": "npm run dev"
}
```

### Performance Optimizations

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options", 
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

## Environment Management

### Environment Protection Rules

**Production Environment:**
- ✅ Required reviewers: @SashankBhamidi
- ✅ Prevent self-review: Disabled (single maintainer)
- ✅ Required status checks before deployment
- ✅ Deployment branch restriction: `master` only

### Environment Variables

**Production Secrets:**
- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Organization identifier
- `VERCEL_PROJECT_ID` - Project identifier

**Build Variables:**
- `NODE_ENV=production` (automatic)
- `VITE_BUILD_TIME` (set during build)

## Deployment Verification

### Automated Checks

After deployment, verify:
- ✅ Site loads successfully (200 status)
- ✅ JavaScript bundles load
- ✅ CSS styles applied
- ✅ API key dialog functions
- ✅ Local storage works

### Manual Testing Checklist

Post-deployment verification:

- [ ] **Basic Functionality**
  - [ ] Site loads at https://synai.site
  - [ ] Chat interface renders correctly
  - [ ] Settings dialog opens

- [ ] **Core Features**
  - [ ] API key management works
  - [ ] Provider selection functions
  - [ ] Message sending (with test key)
  - [ ] File upload interface

- [ ] **Cross-browser Testing**
  - [ ] Chrome/Chromium latest
  - [ ] Firefox latest  
  - [ ] Safari latest
  - [ ] Mobile browsers

## Rollback Procedures

### Quick Rollback

If issues are detected post-deployment:

```bash
# Option 1: Redeploy previous commit
git reset --hard HEAD~1
git push --force-with-lease origin master

# Option 2: Revert specific commit  
git revert <commit-hash>
git push origin master
```

### Vercel Dashboard Rollback

1. Go to Vercel Dashboard
2. Select SynAI project
3. Navigate to "Deployments"
4. Find previous working deployment
5. Click "Promote to Production"

### Emergency Procedures

For critical issues:

1. **Immediate**: Rollback via Vercel dashboard
2. **Short-term**: Fix issue in emergency branch
3. **Long-term**: Root cause analysis and prevention

## Monitoring & Observability

### Deployment Monitoring

**Vercel Analytics (Free Tier):**
- Basic page load times
- Error rates
- Simple traffic analytics

**GitHub Actions:**
- Build success rates
- Test execution times
- Deployment frequency
- Quality gate metrics

### Alerting

**Free Automatic Alerts:**
- Build failures → GitHub email notifications
- Security scan failures → GitHub Issues
- Deployment failures → GitHub email notifications

### Performance Metrics

**Target Metrics:**
- Build time: < 2 minutes
- Bundle size: < 500KB gzipped
- First load: < 3 seconds
- Time to Interactive: < 5 seconds

## Troubleshooting

### Common Deployment Issues

**Build Failures:**
```bash
# Check build locally
npm run build

# Verify all tests pass
npm test

# Check TypeScript
npm run typecheck
```

**Vercel Deployment Failures:**
- Verify secrets are set correctly
- Check Vercel project configuration
- Review build logs in GitHub Actions
- Ensure branch protection rules allow deployment

**API Integration Issues:**
- Test API key validation locally
- Verify CORS settings
- Check network requests in browser dev tools
- Validate provider SDK versions

### Debug Mode

Enable verbose logging:

```bash
# Local development
VITE_DEBUG=true npm run dev

# Build debugging
DEBUG=vite:* npm run build
```

### Log Analysis

**GitHub Actions Logs:**
- Detailed step-by-step execution
- Error messages and stack traces
- Build artifacts and coverage reports

**Vercel Logs:**
- Function execution logs
- Edge network performance
- Error tracking and monitoring

## Security Considerations

### Deployment Security

- ✅ Secrets stored in GitHub encrypted storage
- ✅ No secrets in repository code
- ✅ HTTPS-only for all deployments
- ✅ Security headers configured
- ✅ CSP policies enforced

### Access Control

- ✅ Repository access limited to collaborators
- ✅ Deployment approvals required
- ✅ Environment protection rules
- ✅ Audit logging enabled

## Best Practices

### Pre-deployment

1. **Local Testing**: Always test changes locally
2. **PR Review**: All changes reviewed before merge
3. **Automated Tests**: Full test suite passes
4. **Documentation**: Update docs for new features

### During Deployment

1. **Monitor**: Watch deployment progress
2. **Verify**: Run post-deployment checks
3. **Communicate**: Update team on deployment status
4. **Rollback Plan**: Have rollback procedure ready

### Post-deployment

1. **Verification**: Complete testing checklist
2. **Monitoring**: Watch for errors/performance issues
3. **Documentation**: Update deployment notes
4. **Retrospective**: Learn from any issues

This deployment process ensures reliable, secure, and high-quality releases while maintaining the ability to quickly respond to issues.