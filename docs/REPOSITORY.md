# Repository Configuration

## Repository Settings

### About Section

**Description:**
```
🤖 Multi-provider AI chat interface supporting OpenAI, Anthropic Claude, and Perplexity AI with file upload capabilities. Privacy-first design with local storage.
```

**Website:** https://synai.site

**Topics/Tags:**
```
ai, chatbot, openai, anthropic, claude, perplexity, react, typescript, vite, privacy, local-storage, file-upload, multi-provider, chat-interface, client-side, ai-assistant
```

### Features Configuration

- [x] Wikis (disabled - use docs/ instead)
- [x] Issues 
- [x] Sponsorships
- [x] Preserve this repository (for archival)
- [x] Discussions
- [x] Projects

### Security & Analysis

- [x] Private vulnerability reporting
- [x] Dependency graph
- [x] Dependabot alerts
- [x] Dependabot security updates
- [x] Dependabot version updates
- [x] Code scanning alerts
- [x] Secret scanning alerts

## Branch Protection Rules

### Master Branch Protection

Navigate to: `Settings > Branches > Add rule`

**Branch name pattern:** `master`

#### Protection Settings:

- [x] **Require a pull request before merging**
  - [x] Require approvals: 1
  - [x] Dismiss stale PR approvals when new commits are pushed
  - [x] Require review from code owners
  - [x] Restrict pushes that create files to specific path(s):
    - `docs/`
    - `*.md`

- [x] **Require status checks to pass before merging**
  - [x] Require branches to be up to date before merging
  - Required status checks:
    - `CI / Test Suite (18)`
    - `CI / Test Suite (20)`
    - `CI / Security Scan`
    - `CI / Quality Gate`
    - `CodeQL Security Scan / CodeQL Analysis (javascript-typescript)`

- [x] **Require conversation resolution before merging**

- [x] **Require signed commits**

- [x] **Require linear history**

- [x] **Do not allow bypassing the above settings**
  - Include administrators: Yes

#### Additional Settings:

- [x] **Restrict pushes that create files**
- [x] **Allow force pushes** (disabled)
- [x] **Allow deletions** (disabled)

## Environment Configuration

### Production Environment

Navigate to: `Settings > Environments > New environment`

**Environment name:** `production`

#### Protection Rules:

- [x] **Required reviewers:** @SashankBhamidi
- [x] **Wait timer:** 0 minutes
- [x] **Prevent self-review:** No (only one maintainer)

#### Environment Variables:
- `VERCEL_TOKEN` (secret)
- `VERCEL_ORG_ID` (secret) 
- `VERCEL_PROJECT_ID` (secret)

### Development Environment (Optional)

**Environment name:** `development`

For preview deployments and testing:
- [x] **No protection rules**
- Same environment variables as production

## Actions Configuration

### General Settings

Navigate to: `Settings > Actions > General`

- **Actions permissions:** Allow all actions and reusable workflows
- **Fork pull request workflows:** Require approval for all outside collaborators
- **Artifact and log retention:** 90 days
- **Default workflow permissions:** Read repository contents and packages permissions

### Required Workflows

All workflows located in `.github/workflows/`:

1. **CI** (`ci.yml`) - Run on all PRs and pushes
2. **Deploy** (`deploy.yml`) - Production deployment
3. **CodeQL** (`codeql.yml`) - Security scanning
4. **Test** (`test.yml`) - Additional test configurations

## Issue Configuration

### Labels

Standard labels already configured:
- `bug` - Something isn't working
- `documentation` - Improvements or additions to documentation  
- `duplicate` - This issue or pull request already exists
- `enhancement` - New feature or request
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `invalid` - This doesn't seem right
- `performance` - Performance improvements
- `question` - Further information is requested
- `wontfix` - This will not be worked on

### Issue Templates

Templates located in `.github/ISSUE_TEMPLATE/`:
- `bug_report.md` - Bug reporting template
- `feature_request.md` - Feature suggestion template
- `documentation.md` - Documentation improvements
- `performance.md` - Performance issues
- `config.yml` - Issue template configuration

## PR Configuration

### PR Template

Template located in `.github/pull_request_template.md`

Includes sections for:
- Description of changes
- Type of change checklist
- Testing verification
- Code quality checks
- Documentation updates

### Auto-merge Settings

- [x] Allow auto-merge
- [x] Automatically delete head branches

## Security Configuration

### Private Vulnerability Reporting

- Enabled for responsible disclosure
- Reports go to: hello@sashank.wiki

### Dependabot Configuration

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    open-pull-requests-limit: 10
    target-branch: master
```

### Code Scanning

- CodeQL analysis runs weekly and on pushes/PRs
- Security and quality query suites enabled
- Results automatically create security alerts

## Collaboration Settings

### Manage Access

- **Base permissions:** Read
- **Repository visibility:** Public

### Moderating Comments

- [x] Lock conversations
- [x] Limit interactions during high traffic

### Interaction Limits

Configure when needed:
- Limit to existing users for 24 hours
- Limit to contributors only for periods of high activity

## Repository Insights

### Traffic Analytics

Monitor:
- Views and unique visitors
- Clones and unique cloners
- Popular referrers
- Popular content

### Community Profile

Ensure all items are complete:
- [x] Description
- [x] README
- [x] Code of conduct
- [x] Contributing guidelines
- [x] License
- [x] Issue templates
- [x] Pull request template

## Automated Deployments

### Vercel Integration

1. **Connect Repository:** Link GitHub repo to Vercel project
2. **Configure Build:** Use default Vite settings
3. **Environment Variables:** Set in Vercel dashboard
4. **Disable Auto-Deploy:** Use GitHub Actions instead
5. **Preview Deployments:** Only for PRs (manual approval)

### Deployment Strategy

- **Production:** Only from master branch via GitHub Actions
- **Preview:** Disabled (use local development)
- **Manual Approval:** Required for all production deployments

This configuration ensures a professional, secure, and contributor-friendly repository that maintains high code quality while enabling smooth collaboration.