import { ExternalLink } from 'lucide-react'

function HeroArticle({ article }) {
    if (!article) return null

    return (
        <div className="glass-card fade-in-up" style={{
            marginBottom: '48px',
            overflow: 'hidden',
            position: 'relative'
        }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '0'
            }}>
                {article.image && (
                    <div style={{
                        width: '100%',
                        height: '400px',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <img
                            src={article.image}
                            alt={article.title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.6s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '50%',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
                        }}></div>
                    </div>
                )}

                <div style={{ padding: '32px' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        backgroundColor: 'var(--accent)',
                        color: 'white',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        marginBottom: '16px',
                        letterSpacing: '0.5px'
                    }}>
                        Top Story
                    </div>

                    <h2 style={{
                        fontSize: '36px',
                        fontWeight: '800',
                        marginBottom: '16px',
                        lineHeight: '1.2',
                        color: 'var(--text-primary)'
                    }}>
                        <a href={article.url} target="_blank" rel="noopener noreferrer" style={{
                            color: 'inherit',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'color 0.2s ease'
                        }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>
                            {article.title}
                            <ExternalLink size={24} style={{ opacity: 0.6 }} />
                        </a>
                    </h2>

                    <p style={{
                        fontSize: '18px',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        marginBottom: '20px'
                    }}>
                        {article.summary || 'No summary available.'}
                    </p>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: '14px',
                        color: 'var(--text-secondary)'
                    }}>
                        <span style={{
                            fontWeight: '600',
                            color: 'var(--accent)'
                        }}>
                            {article.source_name || article.source}
                        </span>
                        <span style={{
                            borderLeft: '1px solid var(--border)',
                            paddingLeft: '16px'
                        }}>
                            {new Date(article.published).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroArticle
