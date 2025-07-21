# SynAI

Multi-provider AI chat interface supporting OpenAI, Anthropic Claude, and Perplexity AI with file upload capabilities.

> **Note**: This repository uses `master` as the main branch. All deployments happen only from `master` branch pushes.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://choosealicense.com/licenses/mit/)

## Features

- **Multi-Provider Support**: OpenAI GPT, Anthropic Claude, Perplexity AI
- **File Uploads**: Images, PDFs, text files with content extraction  
- **Conversation Management**: Persistent chat history, search, branching
- **Responsive Design**: Mobile and desktop optimized
- **Theme Support**: Dark/light modes with customization
- **Local Storage**: API keys and conversations stored locally
- **Privacy-First**: No data sent to external servers, everything runs client-side

## Quick Start

```bash
# Clone and install
git clone https://github.com/SashankBhamidi/SynAI.git
cd SynAI
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` and configure API keys in Settings.

## API Keys

Get your API keys from:
- [OpenAI Platform](https://platform.openai.com/api-key)
- [Anthropic Console](https://console.anthropic.com/settings/keys)
- [Perplexity AI](https://www.perplexity.ai/account/api/keys)

Keys are stored locally and never transmitted externally.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview build |
| `npm run lint` | Fix linting issues |
| `npm run typecheck` | Type checking |
| `npm test` | Run tests |

## Documentation

- [Setup Guide](docs/setup.md)
- [API Integration](docs/api-integration.md)
- [Vercel Deployment](docs/vercel-setup.md)
- [Contributing](CONTRIBUTING.md)

## Tech Stack

- React 18 + TypeScript
- Vite build tool
- Tailwind CSS + Radix UI
- AI provider SDKs

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test && npm run typecheck && npm run lint`
5. Submit a pull request

## Community

- 🐛 [Report Bugs](https://github.com/SashankBhamidi/SynAI/issues/new?template=bug_report.md)
- 💡 [Request Features](https://github.com/SashankBhamidi/SynAI/issues/new?template=feature_request.md)
- 💬 [Discussions](https://github.com/SashankBhamidi/SynAI/discussions)

## License

MIT © [Sashank Bhamidi](https://github.com/SashankBhamidi) - see [LICENSE](LICENSE) for details.