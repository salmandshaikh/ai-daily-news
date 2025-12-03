import ArticleCard from './ArticleCard'

function NewsGrid({ articles }) {
    if (!articles || articles.length === 0) return null

    // Enhanced bento grid pattern with more variety
    const getCardSize = (index) => {
        const patterns = [
            // Pattern 1: Featured + Normal grid
            { gridColumn: 'span 2', gridRow: 'span 2', type: 'featured' }, // Large featured
            { gridColumn: 'span 1', gridRow: 'span 1', type: 'normal' },
            { gridColumn: 'span 1', gridRow: 'span 1', type: 'normal' },
            { gridColumn: 'span 1', gridRow: 'span 2', type: 'tall' },      // Tall
            { gridColumn: 'span 2', gridRow: 'span 1', type: 'wide' },      // Wide
            { gridColumn: 'span 1', gridRow: 'span 1', type: 'normal' },
            { gridColumn: 'span 1', gridRow: 'span 1', type: 'normal' },
            { gridColumn: 'span 1', gridRow: 'span 2', type: 'tall' },
            { gridColumn: 'span 2', gridRow: 'span 1', type: 'wide' },
            { gridColumn: 'span 1', gridRow: 'span 1', type: 'normal' },
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
                            gridRow: size.gridRow,
                            animation: `fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.08}s both`
                        }}
                    >
                        <ArticleCard article={article} size={size} />
                    </div>
                )
            })}
        </div>
    )
}

export default NewsGrid
