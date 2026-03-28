import { Zap, Database, Clock, Mic, Brain } from 'lucide-react'

const stats = [
    { icon: Brain, value: '30+', label: 'Articles/Day', color: 'var(--accent)' },
    { icon: Database, value: '4', label: 'Sources Monitored', color: 'var(--accent-2)' },
    { icon: Clock, value: 'Every 4h', label: 'Auto-Updated', color: 'var(--success)' },
    { icon: Zap, value: 'AI', label: 'Powered Summaries', color: 'var(--warning)' },
    { icon: Mic, value: 'Daily', label: 'Podcast Briefing', color: 'var(--accent)' },
]

function ValuePropBanner() {
    return (
        <section className="value-prop-banner" aria-label="Platform overview">
            <div className="container">
                <div className="value-prop-content">
                    <div className="value-prop-badge">
                        <span className="badge-dot"></span>
                        Live — updating every 4 hours
                    </div>

                    <h1 className="value-prop-headline">
                        AI Intelligence,{' '}
                        <span className="gradient-text">Fully Automated.</span>
                    </h1>

                    <p className="value-prop-subheadline">
                        A production-grade AI news intelligence platform that aggregates, summarizes, and delivers the most important developments in artificial intelligence and machine learning — without human intervention.
                    </p>

                    <div className="value-prop-stats">
                        {stats.map(({ icon: Icon, value, label, color }) => (
                            <div className="stat-card" key={label}>
                                <div className="stat-icon" style={{ color }}>
                                    <Icon size={20} />
                                </div>
                                <div className="stat-value">{value}</div>
                                <div className="stat-label">{label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="value-prop-sources">
                        <span className="sources-label">Aggregating from</span>
                        {['OpenAI Blog', 'DeepMind', 'Hugging Face', 'arXiv', 'Hacker News', 'Reddit AI'].map(src => (
                            <span key={src} className="source-chip">{src}</span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ValuePropBanner
