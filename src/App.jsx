import { useState, useEffect } from 'react'
import Header from './components/Header'
import HeroArticle from './components/HeroArticle'
import NewsGrid from './components/NewsGrid'
import PodcastPlayer from './components/PodcastPlayer'
import ValuePropBanner from './components/ValuePropBanner'
import { Github, Linkedin, Mail, Rss, Cpu, Globe, Zap, Shield, BarChart2, ArrowUpRight } from 'lucide-react'

const techStack = [
    { name: 'Groq LLaMA 3.3', role: 'AI Summarization', color: 'var(--accent)' },
    { name: 'OpenRouter', role: 'Fallback LLM', color: 'var(--accent-2)' },
    { name: 'Edge TTS', role: 'Podcast Voice', color: 'var(--success)' },
    { name: 'GitHub Actions', role: 'Auto-Deployment', color: 'var(--warning)' },
    { name: 'React + Vite', role: 'Frontend', color: 'var(--accent)' },
    { name: 'Python + RSS', role: 'Data Pipeline', color: 'var(--accent-2)' },
]

const highlights = [
    {
        icon: Zap,
        title: 'Fully Automated Pipeline',
        desc: 'Zero manual effort. News is collected, summarized, and published every 4 hours via a self-maintaining GitHub Actions workflow.',
    },
    {
        icon: Cpu,
        title: 'LLM-Powered Summaries',
        desc: 'Every article is summarized by LLaMA 3.3 70B via Groq API — concise, accurate, and context-aware. Fallback to OpenRouter ensures 100% uptime.',
    },
    {
        icon: Rss,
        title: 'Multi-Source Aggregation',
        desc: 'Pulls from OpenAI Blog, DeepMind, Hugging Face, arXiv, Hacker News, and Reddit — deduplicating and ranking for relevance.',
    },
    {
        icon: Mic2Icon,
        title: 'Daily Podcast Briefing',
        desc: 'Top stories are scripted into a 2-minute conversational podcast and synthesized with Microsoft Edge TTS — no studio required.',
    },
    {
        icon: Globe,
        title: 'Hosted at Zero Cost',
        desc: 'Fully deployed on GitHub Pages with no server costs. The architecture scales to millions of readers with no infrastructure changes.',
    },
    {
        icon: BarChart2,
        title: 'Built to Scale',
        desc: 'Modular Python pipeline means adding new sources, LLMs, or output formats takes hours, not weeks. Production-ready from day one.',
    },
]

function Mic2Icon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" x2="12" y1="19" y2="22"/>
        </svg>
    )
}

function App() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light'
    })
    const [newsData, setNewsData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    useEffect(() => {
        fetch(`data/news.json?t=${new Date().getTime()}`)
            .then(response => response.json())
            .then(data => {
                setNewsData(data)
                setLoading(false)
            })
            .catch(error => {
                console.error('Error loading news:', error)
                setLoading(false)
            })
    }, [])

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    return (
        <div className="app">
            <Header theme={theme} toggleTheme={toggleTheme} />

            <main style={{ flex: 1, paddingTop: '70px' }}>
                {/* Value Proposition Banner */}
                <ValuePropBanner />

                {/* News Content */}
                <section className="news-section" id="latest" aria-label="Latest AI news">
                    <div className="container">
                        {loading ? (
                            <div style={{ padding: '60px 0' }}>
                                <div className="skeleton" style={{ height: '400px', borderRadius: '16px', marginBottom: '24px' }}></div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="skeleton" style={{ height: '300px', borderRadius: '16px' }}></div>
                                    ))}
                                </div>
                            </div>
                        ) : newsData && newsData.articles && newsData.articles.length > 0 ? (
                            <>
                                <div className="news-meta-bar">
                                    <div className="live-indicator">
                                        <span className="live-dot"></span>
                                        Live Feed
                                    </div>
                                    <span className="last-updated">
                                        Updated {new Date(newsData.updated).toLocaleString(undefined, {
                                            month: 'short', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                </div>

                                <HeroArticle article={newsData.articles[0]} />

                                {newsData.podcast && <PodcastPlayer podcast={newsData.podcast} />}

                                <NewsGrid articles={newsData.articles.slice(1)} />
                            </>
                        ) : (
                            <div className="empty-state">
                                <p>No articles available at this time. Check back in a few hours.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* About / Platform Section */}
                <section className="about-section" id="about" aria-label="About AI Daily News">
                    <div className="container">
                        <div className="section-header">
                            <span className="section-eyebrow">The Platform</span>
                            <h2 className="section-title">Built for the AI Era</h2>
                            <p className="section-subtitle">
                                AI Daily News is a production-grade media intelligence platform built entirely with automation. No editors, no manual curation — just a robust pipeline that keeps running.
                            </p>
                        </div>

                        <div className="highlights-grid">
                            {highlights.map(({ icon: Icon, title, desc }) => (
                                <div className="highlight-card" key={title}>
                                    <div className="highlight-icon">
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="highlight-title">{title}</h3>
                                    <p className="highlight-desc">{desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Tech Stack */}
                        <div className="tech-stack-section">
                            <h3 className="tech-stack-label">Technology Stack</h3>
                            <div className="tech-stack-grid">
                                {techStack.map(({ name, role, color }) => (
                                    <div className="tech-chip" key={name}>
                                        <span className="tech-dot" style={{ backgroundColor: color }}></span>
                                        <span className="tech-name">{name}</span>
                                        <span className="tech-role">{role}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Investor / Partner CTA */}
                        <div className="investor-cta" id="contact">
                            <div className="investor-cta-content">
                                <div className="investor-cta-text">
                                    <h3>Interested in this project?</h3>
                                    <p>
                                        Whether you're an investor, a publisher, or a company looking to integrate automated AI intelligence into your product — I'd love to hear from you.
                                    </p>
                                    <ul className="investor-points">
                                        <li><Shield size={14} /> White-label licensing available</li>
                                        <li><Shield size={14} /> Custom source integrations</li>
                                        <li><Shield size={14} /> API access & enterprise plans</li>
                                    </ul>
                                </div>
                                <div className="investor-cta-actions">
                                    <a href="mailto:contact@example.com" className="cta-button cta-primary">
                                        Get in touch
                                        <ArrowUpRight size={16} />
                                    </a>
                                    <a
                                        href="https://github.com/salmandshaikh/ai-daily-news"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cta-button cta-secondary"
                                    >
                                        <Github size={16} />
                                        View on GitHub
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="site-footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <span className="logo-dot"></span>
                                AI Daily News
                            </div>
                            <p className="footer-tagline">
                                Automated AI intelligence platform. Built by <a href="https://github.com/salmandshaikh" target="_blank" rel="noopener noreferrer">Salman Shaikh</a>.
                            </p>
                            <div className="footer-social">
                                <a href="https://github.com/salmandshaikh/ai-daily-news" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="social-link">
                                    <Github size={18} />
                                </a>
                                <a href="mailto:contact@example.com" aria-label="Email" className="social-link">
                                    <Mail size={18} />
                                </a>
                            </div>
                        </div>

                        <div className="footer-links-group">
                            <h4>Platform</h4>
                            <ul>
                                <li><a href="#latest">Latest News</a></li>
                                <li><a href="#about">About</a></li>
                                <li><a href="#contact">Contact</a></li>
                            </ul>
                        </div>

                        <div className="footer-links-group">
                            <h4>Sources</h4>
                            <ul>
                                <li><span>OpenAI Blog</span></li>
                                <li><span>DeepMind</span></li>
                                <li><span>Hugging Face</span></li>
                                <li><span>arXiv Papers</span></li>
                                <li><span>Hacker News</span></li>
                            </ul>
                        </div>

                        <div className="footer-links-group">
                            <h4>Built with</h4>
                            <ul>
                                <li><span>Groq + LLaMA 3.3</span></li>
                                <li><span>React + Vite</span></li>
                                <li><span>GitHub Actions</span></li>
                                <li><span>Edge TTS</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <span>© {new Date().getFullYear()} AI Daily News. All rights reserved.</span>
                        <span className="footer-powered">Powered by Groq & OpenRouter</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default App
