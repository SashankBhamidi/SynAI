# Getting Started with SynAI

Welcome to SynAI! This guide will help you get up and running quickly with our enterprise-grade AI chat interface.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (version 9 or higher) - Usually comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## 🚀 Quick Installation

### 1. Clone the Repository

```bash
git clone https://github.com/SashankBhamidi/SynAI.git
cd SynAI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔑 Setting Up API Keys

To use SynAI, you'll need API keys from at least one AI provider:

### OpenAI (Required for GPT models)
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Generate a new API key
4. Copy the key (it starts with `sk-`)

### Anthropic Claude (Optional)
1. Visit [Anthropic Console](https://console.anthropic.com/settings/keys)
2. Create an account or sign in
3. Generate a new API key
4. Copy the key (it starts with `sk-ant-`)

### Perplexity AI (Optional)
1. Visit [Perplexity AI Settings](https://www.perplexity.ai/settings/api)
2. Create an account or sign in
3. Generate a new API key
4. Copy the key

### Adding Keys to SynAI
1. Open SynAI in your browser
2. Click the **Settings** gear icon in the top right
3. Navigate to the **API Keys** section
4. Paste your API keys in the appropriate fields
5. Click **Save**

> **🔒 Security Note**: API keys are stored locally in your browser and never transmitted to external servers.

## 🎯 First Chat

1. With API keys configured, you'll see the chat interface
2. Select your preferred AI provider from the dropdown
3. Choose a model (e.g., GPT-4, Claude-3)
4. Type your message and press Enter or click Send
5. Wait for the AI response

## 📁 Key Features to Explore

### Conversation Management
- **New Conversation**: Click the "+" button to start fresh
- **Search Conversations**: Use the search bar to find past chats
- **Organize in Folders**: Create folders to organize your conversations

### File Uploads
- **Images**: Upload images for AI analysis
- **PDFs**: Upload documents for content extraction and discussion
- **Text Files**: Upload various document formats

### Advanced Features
- **Message Templates**: Use pre-built prompts for common tasks
- **Conversation Branching**: Explore different conversation paths
- **Theme Customization**: Switch between dark/light modes
- **Keyboard Shortcuts**: Use Ctrl+Enter to send messages quickly

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run test suite |
| `npm run typecheck` | Check TypeScript types |
| `npm run lint` | Check and fix code style |

## 📖 Next Steps

### For Users
- Explore the [Features Documentation](FEATURES.md)
- Learn about [Advanced Usage](ADVANCED_USAGE.md)
- Check out [Tips and Tricks](TIPS_AND_TRICKS.md)

### For Developers
- Read the [Architecture Guide](ARCHITECTURE.md)
- Review [Contributing Guidelines](../CONTRIBUTING.md)
- Explore the [API Integration Guide](api-integration.md)

### For Deployment
- Follow the [Production Deployment Guide](DEPLOYMENT.md)
- Learn about [Vercel Deployment](vercel-setup.md)
- Review [Security Best Practices](SECURITY_BEST_PRACTICES.md)

## 🆘 Troubleshooting

### Common Issues

#### Development Server Won't Start
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### API Keys Not Working
- Verify keys are correctly copied (no extra spaces)
- Check if keys have proper permissions
- Ensure you have sufficient credits/quota with the provider

#### Build Failures
```bash
# Check for TypeScript errors
npm run typecheck

# Check for linting issues
npm run lint:check

# Clear build cache
rm -rf dist
npm run build
```

### Getting Help

1. **Search Issues**: Check [existing issues](https://github.com/SashankBhamidi/SynAI/issues)
2. **Create New Issue**: Use our [issue templates](https://github.com/SashankBhamidi/SynAI/issues/new/choose)
3. **Join Discussions**: Ask questions in [GitHub Discussions](https://github.com/SashankBhamidi/SynAI/discussions)
4. **Community Support**: Get help from other users and contributors

## 🎉 Welcome to the Community!

Congratulations! You're now ready to explore the full potential of SynAI. 

- ⭐ **Star the repository** if you find it useful
- 🐛 **Report issues** to help improve the project
- 💡 **Suggest features** for future releases
- 🤝 **Contribute** to make SynAI even better

Happy chatting with AI! 🚀