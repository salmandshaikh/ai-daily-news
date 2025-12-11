# 🤖 AI Daily News Aggregator

[![Deploy Status](https://github.com/salmandshaikh/ai-daily-news/actions/workflows/daily-update.yml/badge.svg)](https://github.com/salmandshaikh/ai-daily-news/actions)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://salmandshaikh.github.io/ai-daily-news/)

> Automated AI and machine learning news aggregator with intelligent summarization. Updated every 4 hours.

## 🌐 Live Demo

**[https://salmandshaikh.github.io/ai-daily-news/](https://salmandshaikh.github.io/ai-daily-news/)**

## ✨ Features

- **🤖 AI-Powered Summarization**: Uses Groq and OpenRouter LLMs to generate concise summaries
- **📰 Multi-Source Aggregation**: Combines news from RSS feeds, Hacker News, Reddit, and arXiv
- **🔄 Automatic Updates**: Runs every 4 hours via GitHub Actions
- **🎨 Modern UI**: Responsive React app with dark/light mode and smooth animations
- **🖼️ Smart Image Fetching**: DuckDuckGo search with Unsplash fallback
- **⚡ Zero Maintenance**: Fully automated pipeline
- **🔍 SEO Optimized**: Comprehensive meta tags, Open Graph, Twitter Cards, and structured data

## 🛠️ Technology Stack

### Backend
- **Python 3.10** - Core scripting language
- **requests** - HTTP client for API calls
- **feedparser** - RSS/Atom feed parsing
- **beautifulsoup4** - HTML parsing for image extraction
- **duckduckgo-search** - Image search without API key

### Frontend
- **React 18.2** - UI framework
- **Vite 5.0** - Build tool and dev server
- **Framer Motion 10.16** - Animation library
- **Lucide React** - Icon library

### AI Services
- **Groq** (llama-3.3-70b-versatile) - Primary LLM for summarization
- **OpenRouter** (llama-3.1-8b-instruct) - Fallback LLM

### Infrastructure
- **GitHub Actions** - CI/CD automation
- **GitHub Pages** - Static site hosting

## 📊 Data Sources

1. **RSS Feeds**: OpenAI Blog, DeepMind Blog, HuggingFace Blog
2. **Hacker News**: Top stories filtered for AI keywords
3. **Reddit**: r/LocalLLaMA, r/ArtificialIntelligence, r/MachineLearning
4. **arXiv**: Latest CS.AI and CS.LG papers

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- API keys for Groq and OpenRouter

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/salmandshaikh/ai-daily-news.git
cd ai-daily-news
```

2. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

3. **Install Node dependencies**
```bash
npm install
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env and add your API keys:
# GROQ_API_KEY=your_groq_key
# OPENROUTER_API_KEY=your_openrouter_key
```

5. **Run the aggregator**
```bash
python src/main.py
```

6. **Start the development server**
```bash
npm run dev
```

## 📦 Deployment

The project automatically deploys to GitHub Pages via GitHub Actions:

1. **Set up GitHub Secrets**:
   - `GROQ_API_KEY`
   - `OPENROUTER_API_KEY`

2. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`

3. **Trigger Deployment**:
   - Push to `main` branch
   - Manual trigger via Actions tab
   - Automatic: Every 4 hours

## 🔍 SEO Features

- ✅ Comprehensive meta tags (title, description, keywords)
- ✅ Open Graph tags for Facebook/LinkedIn sharing
- ✅ Twitter Card meta tags
- ✅ Structured data (JSON-LD) for rich snippets
- ✅ robots.txt for search engine crawling
- ✅ sitemap.xml for better indexing
- ✅ PWA manifest for mobile installation
- ✅ Canonical URLs
- ✅ Semantic HTML structure

## 📈 Performance

- **Update Frequency**: Every 4 hours (6x daily)
- **Articles per Run**: Up to 100
- **Processing Time**: 5-8 minutes
- **Daily Capacity**: ~600 articles

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│     Data Sources (4 platforms)     │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Python Backend (scrapers.py)       │
│  • Deduplication                    │
│  • Image fetching (DuckDuckGo)      │
│  • AI summarization (Groq/OpenRouter)│
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Storage (news.json + images/)      │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  React Frontend (Vite build)        │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  GitHub Pages (CDN hosting)         │
└─────────────────────────────────────┘
```

## 📁 Project Structure

```
ai-daily-news/
├── .github/workflows/
│   └── daily-update.yml       # GitHub Actions workflow
├── public/
│   ├── robots.txt             # SEO: Search engine directives
│   ├── sitemap.xml            # SEO: Site structure
│   └── manifest.json          # PWA manifest
├── src/
│   ├── components/            # React components
│   ├── main.py                # Python orchestration
│   ├── scrapers.py            # Data collection
│   ├── summarizer.py          # LLM integration
│   └── image_generator.py     # Image management
├── data/
│   ├── news.json              # Generated news data
│   └── images/                # Cached images
└── index.html                 # SEO-optimized HTML
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Salman Shaikh**
- GitHub: [@salmandshaikh](https://github.com/salmandshaikh)

## 🙏 Acknowledgments

- News sources: OpenAI, DeepMind, HuggingFace, Hacker News, Reddit, arXiv
- AI models: Groq (Meta Llama), OpenRouter
- Image sources: DuckDuckGo, Unsplash

---

*Built with ❤️ using React, Python, and AI*
