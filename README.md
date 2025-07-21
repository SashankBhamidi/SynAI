# SynAI

<div align="center">

**Enterprise-grade multi-provider AI chat interface with file upload capabilities**

[![CI](https://github.com/SashankBhamidi/SynAI/workflows/CI/badge.svg)](https://github.com/SashankBhamidi/SynAI/actions)
[![Security](https://github.com/SashankBhamidi/SynAI/workflows/Security/badge.svg)](https://github.com/SashankBhamidi/SynAI/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://choosealicense.com/licenses/mit/)

[**Live Demo**](https://synai.site) • [**Documentation**](docs/) • [**Contributing**](CONTRIBUTING.md) • [**Issues**](https://github.com/SashankBhamidi/SynAI/issues)

</div>

## 🚀 Overview

SynAI is a production-ready, privacy-first AI chat interface that supports multiple AI providers in a unified experience. Built with enterprise-grade architecture, comprehensive testing, and designed for extensibility.

### ✨ Key Features

- 🤖 **Multi-Provider Support**: OpenAI GPT, Anthropic Claude, Perplexity AI
- 📎 **File Upload Capabilities**: Images, PDFs, documents with intelligent content extraction
- 💬 **Advanced Chat Features**: Conversation branching, search, templates, and history
- 🎨 **Modern UI/UX**: Responsive design, dark/light themes, accessibility-first
- 🔒 **Privacy-First Architecture**: All data stored locally, zero external tracking
- 🏢 **Enterprise Ready**: Comprehensive testing, CI/CD, security auditing
- 🔧 **Developer Friendly**: TypeScript, extensive documentation, contribution guidelines

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Features](#-features)
- [Architecture](#-architecture)
- [Development](#-development)
- [Contributing](#-contributing)
- [Community](#-community)
- [License](#-license)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Modern web browser
- API keys for desired AI providers

### Installation

```bash
# Clone the repository
git clone https://github.com/SashankBhamidi/SynAI.git
cd SynAI

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to access SynAI.

### API Configuration

1. Click the Settings icon in the interface
2. Add your API keys:
   - **OpenAI**: [Get API Key](https://platform.openai.com/api-keys)
   - **Anthropic**: [Get API Key](https://console.anthropic.com/settings/keys)
   - **Perplexity**: [Get API Key](https://www.perplexity.ai/settings/api)

> **Security Note**: API keys are stored locally in your browser and never transmitted to external servers.

## ✨ Features

### AI Providers
- **OpenAI GPT Models**: GPT-4, GPT-3.5 Turbo with various configurations
- **Anthropic Claude**: Claude-3 family with different capability tiers
- **Perplexity AI**: Web-enhanced AI responses with real-time information

### Chat Capabilities
- **Conversation Management**: Organize chats in folders, search conversations
- **Message Templates**: Pre-defined prompts for common use cases
- **Conversation Branching**: Explore different conversation paths
- **Export/Import**: Share conversations and settings

### File Processing
- **Image Analysis**: Upload and analyze images with AI vision models
- **PDF Processing**: Extract and process content from PDF documents
- **Document Support**: Handle various document formats with intelligent parsing

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation
- **Customizable Themes**: Dark/light modes with custom color schemes
- **Keyboard Shortcuts**: Power-user features for efficient navigation

## 🏗️ Architecture

SynAI follows enterprise-grade architectural patterns:

### Frontend Architecture
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base design system components
│   └── ...             # Feature-specific components
├── services/           # AI provider integrations
│   └── providers/      # Individual provider implementations
├── utils/              # Utilities and helpers
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── contexts/           # React context providers
```

### Key Architectural Principles
- **Separation of Concerns**: Clear boundaries between UI, business logic, and data
- **Provider Pattern**: Extensible AI provider integration system
- **Component Composition**: Reusable, testable component architecture
- **Type Safety**: Comprehensive TypeScript coverage
- **Error Handling**: Robust error boundaries and graceful degradation

## 🛠️ Development

### Development Workflow

```bash
# Start development server
npm run dev

# Run tests
npm test

# Type checking
npm run typecheck

# Linting and formatting
npm run lint
npm run lint:check

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing Strategy

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: AI provider service testing
- **End-to-End Tests**: Critical user flow validation
- **Type Checking**: Comprehensive TypeScript validation

### Quality Assurance

- **ESLint**: Code quality and consistency enforcement
- **TypeScript Strict Mode**: Enhanced type safety
- **Automated Testing**: CI/CD pipeline integration
- **Security Auditing**: Dependency vulnerability scanning

## 🤝 Contributing

We welcome contributions from the community! SynAI is designed to be contributor-friendly with comprehensive documentation and clear guidelines.

### Ways to Contribute

- 🐛 **Bug Reports**: Help us identify and fix issues
- 💡 **Feature Requests**: Suggest new capabilities
- 🔧 **Code Contributions**: Implement features and fixes
- 📚 **Documentation**: Improve guides and examples
- 🎨 **Design**: Enhance UI/UX and accessibility

### Getting Started

1. Read our [Contributing Guide](CONTRIBUTING.md)
2. Check [Good First Issues](https://github.com/SashankBhamidi/SynAI/labels/good%20first%20issue)
3. Join our [Discussions](https://github.com/SashankBhamidi/SynAI/discussions)
4. Review the [Code of Conduct](CODE_OF_CONDUCT.md)

### Development Setup

See our detailed [Development Guide](CONTRIBUTING.md#development-setup) for complete setup instructions.

## 📖 Documentation

| Resource | Description |
|----------|-------------|
| [**Setup Guide**](docs/setup.md) | Complete installation and configuration |
| [**API Integration**](docs/api-integration.md) | Adding new AI providers |
| [**Architecture Guide**](docs/ARCHITECTURE.md) | Technical architecture overview |
| [**Deployment Guide**](docs/DEPLOYMENT.md) | Production deployment instructions |
| [**Contributing Guide**](CONTRIBUTING.md) | Contribution guidelines and workflows |

## 🌟 Community

<div align="center">

### Join our growing community of contributors and users!

[![GitHub Discussions](https://img.shields.io/badge/GitHub-Discussions-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SashankBhamidi/SynAI/discussions)
[![Issues](https://img.shields.io/badge/GitHub-Issues-red?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SashankBhamidi/SynAI/issues)

</div>

### Community Guidelines

- **Be Respectful**: Follow our [Code of Conduct](CODE_OF_CONDUCT.md)
- **Be Helpful**: Assist other community members
- **Be Constructive**: Provide actionable feedback and suggestions
- **Be Patient**: Maintainers and contributors are volunteers

### Getting Support

1. **Documentation**: Check our [docs](docs/) first
2. **Search Issues**: Look for existing solutions
3. **GitHub Discussions**: Ask questions and share ideas
4. **Create Issues**: Report bugs or request features

## 🔒 Security

Security is a top priority for SynAI:

- **Privacy-First**: No data collection or external tracking
- **Local Storage**: API keys and conversations stored locally
- **Security Auditing**: Regular dependency vulnerability scanning
- **Responsible Disclosure**: [Security Policy](SECURITY.md)

## 📊 Project Status

- ✅ **Stable**: Production-ready with comprehensive testing
- 🔄 **Active Development**: Regular updates and improvements
- 🤝 **Community Driven**: Open to contributions and feedback
- 📈 **Growing**: Expanding feature set and provider support

## 🙏 Acknowledgments

- Thanks to all [contributors](https://github.com/SashankBhamidi/SynAI/graphs/contributors) who have helped improve SynAI
- Built with amazing open source technologies and libraries
- Inspired by the AI community's commitment to accessible AI tools

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by [Sashank Bhamidi](https://github.com/SashankBhamidi) and the SynAI community**

[⭐ Star this project](https://github.com/SashankBhamidi/SynAI/stargazers) • [🐛 Report Issues](https://github.com/SashankBhamidi/SynAI/issues) • [💡 Request Features](https://github.com/SashankBhamidi/SynAI/issues/new?template=feature_request.yml)

</div>