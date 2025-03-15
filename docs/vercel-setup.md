# Vercel Deployment Setup

This guide shows how to connect your GitHub repository with Vercel for automated deployments.

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Vercel Token

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your profile → Settings
3. Go to "Tokens" tab
4. Click "Create Token"
5. Name it: `SynAI GitHub Actions`
6. Copy the token (you'll need it in Step 3)

### Step 2: Link Project to Vercel

Option A: **Import from GitHub (Recommended)**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → Project
3. Import your `SashankBhamidi/SynAI` repository
4. Configure:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

Option B: **Use Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Link your project
cd /path/to/synai.site
vercel link

# Follow the prompts to connect to your Vercel project
```

### Step 3: Add GitHub Secrets

1. Go to your GitHub repository: `github.com/SashankBhamidi/SynAI`
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add these secrets:

| Secret Name | Value | Description |
|-------------|--------|-------------|
| `VERCEL_TOKEN` | `your_token_from_step_1` | Vercel API token |
| `VERCEL_ORG_ID` | `team_xxx` or `your_username` | Find in Vercel project settings |
| `VERCEL_PROJECT_ID` | `prj_xxx` | Find in Vercel project settings |

**To find ORG_ID and PROJECT_ID:**
1. Go to your Vercel project
2. Settings tab
3. Copy "Project ID" and "Team ID" (or use your username if personal)

### Step 4: Configure Branch Protection

1. In GitHub: Settings → Branches
2. Add rule for `master` branch:
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - Select: `test`, `build-check`
   - ✅ Restrict pushes to matching branches

## 🔄 How It Works

### Current Setup (Auto-Deploy from Vercel)
- ✅ Vercel watches `main` branch
- ✅ Auto-deploys on every push to `main`
- ❌ No testing before deploy

### New Setup (GitHub Actions → Vercel)
- ✅ GitHub Actions run tests first
- ✅ Only deploy if all tests pass
- ✅ Deploy only from `master` branch
- ✅ PRs don't trigger deployments
- ✅ Full build verification

### Deployment Flow

```
1. Push to master → GitHub Actions triggered
2. Run tests (TypeScript, ESLint, unit tests)
3. Verify build works
4. Deploy to Vercel production
5. Update GitHub deployment status
```

### PR Flow (Safe - No Deployment)

```
1. Create PR → GitHub Actions triggered  
2. Run tests only
3. Show status check results
4. NO deployment happens
5. Safe for contributors
```

## 🔧 Configuration Files

The following files configure Vercel deployment:

### `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{"source": "/(.*)", "destination": "/index.html"}]
}
```

### `.github/workflows/deploy.yml`
- Handles production deployments
- Only runs on `master` branch pushes
- Full test suite before deploy

## 🛡️ Security Features

- **Branch Protection**: Only tested code gets deployed
- **Environment Secrets**: Vercel tokens stored securely
- **PR Safety**: Pull requests never deploy
- **Manual Override**: Can disable auto-deploy if needed

## 📊 Monitoring

After setup, you can monitor deployments:

1. **GitHub**: Actions tab shows all workflow runs
2. **Vercel**: Deployments tab shows deployment history
3. **Status**: GitHub shows deployment status on commits

## 🔍 Troubleshooting

### Common Issues

**"Vercel token invalid"**
- Check token is copied correctly
- Ensure token has correct permissions
- Try generating a new token

**"Project not found"**
- Verify VERCEL_PROJECT_ID is correct
- Check VERCEL_ORG_ID matches your team/username

**"Build failed"**
- Check build works locally: `npm run build`
- Verify all dependencies are in package.json
- Check for environment-specific issues

**"Deployment stuck"**
- Check Vercel dashboard for deployment logs
- Verify GitHub Actions completed successfully
- Try redeploying from Vercel dashboard

## 🚀 Next Steps

1. Complete the setup above
2. Test with a small change to `master`
3. Verify deployment works automatically
4. Optionally: Configure custom domain in Vercel
5. Optionally: Add environment variables in Vercel project settings

Your SynAI project will now have professional, automated deployments! 🎉