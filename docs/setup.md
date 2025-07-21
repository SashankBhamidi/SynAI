# Setup Guide

## Prerequisites

- Node.js 18+
- npm, yarn, or bun
- Modern web browser

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SashankBhamidi/SynAI.git
   cd SynAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## Environment Configuration

Create a `.env.local` file for optional environment variables:

```env
# Application title (optional)
VITE_APP_TITLE=SynAI

# Default provider (optional)
VITE_DEFAULT_PROVIDER=openai

# Enable debug mode (optional)
VITE_ENABLE_DEBUG=false
```

## API Key Setup

1. Open the application in your browser
2. Click the **Settings** icon in the top-right corner
3. Navigate to the **API Keys** tab
4. Enter your API keys for desired providers

### Getting API Keys

**OpenAI**
- Visit [OpenAI Platform](https://platform.openai.com/api-key)
- Create a new API key
- Copy the key to SynAI settings

**Anthropic Claude**
- Visit [Anthropic Console](https://console.anthropic.com/settings/keys)
- Generate an API key
- Copy the key to SynAI settings

**Perplexity AI**
- Visit [Perplexity AI](https://www.perplexity.ai/account/api/keys)
- Create an API key
- Copy the key to SynAI settings

## Development

### Available Commands

```bash
# Development server with hot reload
npm run dev

# Type checking
npm run typecheck

# Linting (auto-fix)
npm run lint

# Production build
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
SynAI/
├── src/
│   ├── components/     # React components
│   ├── services/       # API services
│   ├── types/          # TypeScript definitions
│   ├── utils/          # Utility functions
│   └── ...
├── docs/               # Documentation
└── public/             # Static assets
```

## Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Deployment Platforms

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **Any static host**: Upload the `dist` folder contents

## Troubleshooting

### Common Issues

**Build Fails**
- Run `npm run typecheck` to identify TypeScript errors
- Run `npm run lint` to fix linting issues

**API Keys Not Working**
- Verify keys are correctly entered
- Check browser console for error messages
- Ensure keys have sufficient credits/permissions

**Development Server Issues**
- Clear browser cache
- Delete `node_modules` and run `npm install`
- Check port 5173 is not in use

### Getting Help

- Check [GitHub Issues](https://github.com/SashankBhamidi/SynAI/issues)
- Review [Contributing Guidelines](../CONTRIBUTING.md)
- Submit a new issue with detailed information