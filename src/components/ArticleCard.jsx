import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

function ArticleCard({ article }) {
    const [isHovered, setIsHovered] = useState(false)
    const [ripples, setRipples] = useState([])

    const handleClick = (e) => {
        const card = e.currentTarget
        const rect = card.getBoundingClientRect()
        const ripple = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            id: Date.now()
        }
        setRipples([...ripples, ripple])
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== ripple.id))
        }, 600)
    }


    return (
        <div
            className="article-card"
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                transform: isHovered ? 'scale(1.02) translateY(-4px)' : 'scale(1) translateY(0)',
                zIndex: isHovered ? 10 : 1,
                willChange: 'transform',
                cursor: 'pointer'
            }}
        >
            {/* Ripple Effect */}
            {ripples.map(ripple => (
                <span
                    key={ripple.id}
                    style={{
                        position: 'absolute',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent)',
                        opacity: 0.3,
                        width: '20px',
                        height: '20px',
                        left: `${ripple.x}px`,
                        top: `${ripple.y}px`,
                        transform: 'translate(-50%, -50%) scale(0)',
                        animation: 'ripple 0.6s ease-out',
                        pointerEvents: 'none',
                        zIndex: 20
                    }}
                />
            ))}

            {article.image && (
                <div className="article-image-container" style={{
                    width: '100%',
                    height: '200px', /* Fixed height for consistency */
                    flexShrink: 0,
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <img
                        src={article.image}
                        alt={article.title}
                        loading="lazy"
                        className="article-image"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop'
                        }}
                    />

                    {/* Gradient overlay on hover */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.3s ease'
                    }} />

                    {/* Source badge */}
                    <div className="source-badge" style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        padding: '4px 10px',
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: '700',
                        color: 'white',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        {article.source}
                    </div>
                </div>
            )}

            <div style={{
                padding: '20px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                background: 'var(--bg-card)'
            }}>
                <h3 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    marginBottom: '12px',
                    lineHeight: '1.4',
                    color: 'var(--text-primary)',
                    flexShrink: 0
                }}>
                    <a href={article.url} target="_blank" rel="noopener noreferrer"
                        className="article-link"
                        style={{
                            color: 'inherit',
                            textDecoration: 'none',
                            display: 'flex',
                            gap: '8px'
                        }}>
                        <span style={{ flex: 1 }}>{article.title}</span>
                        <ExternalLink
                            size={14}
                            style={{
                                opacity: isHovered ? 1 : 0,
                                flexShrink: 0,
                                marginTop: '4px',
                                transition: 'opacity 0.2s ease',
                                transform: isHovered ? 'translate(2px, -2px)' : 'translate(0, 0)'
                            }}
                        />
                    </a>
                </h3>

                {/* Summary fills the space */}
                <p style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    marginBottom: '16px',
                    flex: 1,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 6, /* Allow more lines */
                    WebkitBoxOrient: 'vertical'
                }}>
                    {article.summary || article.title}
                </p>


                <div style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto'
                }}>
                    <span style={{ fontWeight: '500' }}>
                        {article.source_name || article.source}
                    </span>
                    <span>
                        {new Date(article.published || Date.now()).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Glow effect on hover */}
            <div style={{
                position: 'absolute',
                inset: -2,
                background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
                borderRadius: '18px',
                opacity: isHovered ? 0.15 : 0,
                filter: 'blur(8px)',
                zIndex: -1,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none'
            }} />
        </div>
    )
}

export default ArticleCard
