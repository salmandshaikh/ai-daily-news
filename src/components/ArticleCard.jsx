import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

function ArticleCard({ article, size, index }) {
    const [isHovered, setIsHovered] = useState(false)
    const [ripples, setRipples] = useState([])

    const isFeatured = size.type === 'featured'
    const isWide = size.type === 'wide' || isFeatured
    const isTall = size.type === 'tall' || isFeatured

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
                transform: isHovered ? 'scale(1.03) translateY(-4px)' : 'scale(1) translateY(0)',
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
                    height: isTall ? '55%' : '45%',
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
                            transform: isHovered ? 'scale(1.15)' : 'scale(1)',
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
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 100%)',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.3s ease'
                    }} />

                    {/* Source badge with animation */}
                    <div className="source-badge" style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        padding: '6px 12px',
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'white',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform 0.2s ease',
                        boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'
                    }}>
                        {article.source}
                    </div>

                    {/* Hover overlay content */}
                    {isHovered && (isWide || isTall) && (
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: '16px',
                            color: 'white',
                            animation: 'slideUp 0.3s ease-out'
                        }}>
                            <p style={{
                                fontSize: '13px',
                                lineHeight: '1.4',
                                margin: 0,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                            }}>
                                {article.summary || article.title}
                            </p>
                        </div>
                    )}
                </div>
            )}

            <div style={{
                padding: isFeatured ? '16px' : isWide ? '14px' : '12px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            }}>
                <h3 style={{
                    fontSize: isFeatured ? '18px' : isWide ? '16px' : '14px',
                    fontWeight: '700',
                    marginBottom: '8px',
                    lineHeight: '1.3',
                    color: 'var(--text-primary)',
                    flex: isTall ? '0 0 auto' : '1',
                    transition: 'color 0.2s ease'
                }}>
                    <a href={article.url} target="_blank" rel="noopener noreferrer"
                        className="article-link"
                        style={{
                            color: 'inherit',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px'
                        }}>
                        <span style={{ flex: 1 }}>{article.title}</span>
                        <ExternalLink
                            size={isFeatured ? 16 : 14}
                            style={{
                                opacity: isHovered ? 0.8 : 0.4,
                                flexShrink: 0,
                                marginTop: '4px',
                                transition: 'opacity 0.2s ease, transform 0.2s ease',
                                transform: isHovered ? 'translate(2px, -2px)' : 'translate(0, 0)'
                            }}
                        />
                    </a>
                </h3>

                {/* Always show summary to fill empty space */}
                <p style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5',
                    marginBottom: '8px',
                    display: '-webkit-box',
                    WebkitLineClamp: article.image ? (isWide ? '3' : '2') : (isTall ? '8' : '4'),
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flex: '1 1 auto'
                }}>
                    {article.summary || article.title}
                </p>


                <div style={{
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    marginTop: 'auto',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    opacity: isHovered ? 1 : 0.8,
                    transition: 'opacity 0.2s ease'
                }}>
                    <span style={{ fontWeight: '600' }}>
                        {article.source_name || article.source}
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
