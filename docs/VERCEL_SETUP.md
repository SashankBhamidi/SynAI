# Vercel Deployment Configuration

## Disabling Automatic Deployments

Since SynAI uses GitHub Actions for controlled deployments with quality gates and manual approval, Vercel's automatic deployments must be disabled.

## Method 1: Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your SynAI project

2. **Access Git Settings**
   - Navigate to `Settings` tab
   - Click `Git` in the sidebar

3. **Disable Auto Deployments**
   - Uncheck `Automatically expose System Environment Variables`
   - Set `Production Branch` to a non-existent branch (e.g., `production-only`)
   - Disable `Deploy Hooks` if any exist

4. **Configure GitHub Integration**
   - Ensure `GitHub App` is connected
   - Set deployment settings:
     - **Production Branch**: Leave empty or set to non-existent branch
     - **Preview Deployments**: Disable or set to manual

## Method 2: Vercel CLI Configuration

```bash
# Install Vercel CLI if not already installed
npm install -g vercel@latest

# Login to Vercel
vercel login

# Link the project (if not linked)
vercel link

# Disable git deployments
vercel env add VERCEL_GIT_DEPLOYMENT_ENABLED
# Set value to: false
# Select scope: Production

# Update deployment settings
vercel --prod --no-wait
```

## Method 3: vercel.json Configuration (Already Applied)

The `vercel.json` file has been updated with:

```json
{
  "git": {
    "deploymentEnabled": false
  }
}
```

## Verification Steps

After making these changes, verify that auto-deployments are disabled:

### 1. Check Vercel Dashboard
- Go to your project dashboard
- The "Git" section should show no automatic deployment triggers
- Recent deployments should only show manual or GitHub Actions deployments

### 2. Test with a Commit
- Make a small commit to a non-master branch
- Push to GitHub
- Verify no Vercel deployment is triggered automatically

### 3. GitHub Repository Settings
In your GitHub repository:
- Go to `Settings` → `Webhooks`
- You should see Vercel webhook but with limited permissions
- Deployments should only come from GitHub Actions

## Correct Deployment Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Git Push      │────│  GitHub Actions  │────│     Vercel      │
│   (to master)   │    │                  │    │                 │
│                 │    │ • Run Tests      │    │ • Deploy Build  │
│                 │    │ • Quality Gate   │    │ • Update Domain │
│                 │    │ • Manual Approval│    │ • Health Check  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## GitHub Actions Integration

Your GitHub Actions workflow handles:
- ✅ Quality gates (tests, linting, security)
- ✅ Manual approval for production deployments
- ✅ Build verification before deployment
- ✅ Deployment to Vercel using CLI/API

## Environment Variables in Vercel

### Required Production Variables
Set these in Vercel Dashboard → Settings → Environment Variables:

- `NODE_ENV` = `production` (automatic)
- No API keys should be stored (client-side app)

### Build-time Variables
These are set by GitHub Actions during deployment:
- `VITE_BUILD_TIME` - Build timestamp
- `VITE_APP_VERSION` - Package version

## Troubleshooting

### Issue: Vercel Still Auto-Deploying

**Solution 1: Check Git Integration**
```bash
# Verify git settings
vercel project ls
vercel project inspect <project-name>
```

**Solution 2: Remove Git Connection Temporarily**
1. Go to Vercel Dashboard → Settings → Git
2. Disconnect GitHub repository
3. Reconnect with manual deployment only
4. Ensure production branch is set to non-existent branch

**Solution 3: Contact Vercel Support**
If automatic deployments persist:
1. Submit ticket at https://vercel.com/help
2. Request manual disabling of git auto-deployments
3. Reference your project URL and GitHub repository

### Issue: GitHub Actions Can't Deploy

**Check Secrets:**
- `VERCEL_TOKEN` - Valid and not expired
- `VERCEL_ORG_ID` - Correct organization ID
- `VERCEL_PROJECT_ID` - Correct project ID

**Verify Permissions:**
```bash
# Test CLI access
vercel --token $VERCEL_TOKEN whoami
vercel --token $VERCEL_TOKEN project ls
```

### Issue: Deployment Domain Issues

**Check Domain Configuration:**
1. Vercel Dashboard → Settings → Domains
2. Ensure `synai.site` is set as production domain
3. Verify DNS records are pointing to Vercel

## Manual Deployment (Emergency)

If GitHub Actions fail, deploy manually:

```bash
# Emergency deployment process
git checkout master
git pull origin master
npm ci
npm run build
vercel --prod --token $VERCEL_TOKEN
```

## Best Practices

### 1. Always Use GitHub Actions
- Never push directly to production
- Always go through PR → approval → merge → deploy flow
- Maintain audit trail of all deployments

### 2. Monitor Deployments
- Check GitHub Actions logs for deployment issues
- Monitor Vercel dashboard for performance
- Set up alerts for deployment failures

### 3. Rollback Procedures
- Keep previous deployments available in Vercel
- Document rollback procedures
- Test rollback process regularly

## Deployment Checklist

Before each release:
- [ ] All tests pass in CI
- [ ] Security scans complete
- [ ] Manual approval obtained
- [ ] Vercel auto-deployment disabled
- [ ] GitHub Actions deployment successful
- [ ] Post-deployment verification complete

This configuration ensures that all deployments go through proper quality gates and approval processes, maintaining the integrity and reliability of the production system.