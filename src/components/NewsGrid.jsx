import ArticleCard from './ArticleCard'
import { useState, useEffect } from 'react'

function NewsGrid({ articles }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    if (!articles || articles.length === 0) return null

    // Smart responsive grid pattern - prevents gaps and ensures uniform layout
    const getCardSize = (index) => {
        // On mobile, all cards are uniform
        if (isMobile) {
            return { gridColumn: 'span 1', gridRow: 'span 1', type: 'normal' }
        }

        // On desktop, use a balanced pattern that fills nicely
        const patterns = [
            { gridColumn: 'span 2', gridRow: 'span 1', type: 'wide' },      // Wide featured
            { gridColumn: 'span 1', gridRow: 'span 1', type: 'normal' },
            { gridColumn: 'span 1', gridRow: 'span 1', type: 'normal' },
            { gridColumn: 'span 1', gridRow: 'span 1', type: 'normal' },
            { gridColumn: 'span 1', gridRow: 'span 1', type: 'normal' },
            { gridColumn: 'span 2', gridRow: 'span 1', type: 'wide' },
        ]
        return patterns[index % patterns.length]
    }

    return (
        <div className="news-grid">
            {articles.map((article, index) => {
                const size = getCardSize(index)
                return (
                    <div
                        key={article.url || index}
                        className="news-grid-item"
                        style={{
                            gridColumn: size.gridColumn,
                            animation: `fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s both`
                        }}
                    >
                        <ArticleCard article={article} size={size} index={index} />
                    </div>
                )
            })}
        </div>
    )
}

export default NewsGrid
