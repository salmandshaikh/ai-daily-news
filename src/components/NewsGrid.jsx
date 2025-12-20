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

    // Unified grid layout - all cards are same size
    return (
        <div className="news-grid">
            {articles.map((article, index) => (
                <div
                    key={article.url || index}
                    className="news-grid-item"
                    style={{
                        animation: `fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s both`
                    }}
                >
                    <ArticleCard article={article} index={index} />
                </div>
            ))}
        </div>
    )
}

export default NewsGrid
