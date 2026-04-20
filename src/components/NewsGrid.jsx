import ArticleCard from './ArticleCard'

function NewsGrid({ articles }) {
    if (!articles || articles.length === 0) return null

    // First 3 → secondary featured row
    const secondary = articles.slice(0, 3)
    // Rest → 4-column newspaper grid
    const grid = articles.slice(3)

    // Distribute grid articles across 4 columns (top-to-bottom fill)
    const cols = [[], [], [], []]
    grid.forEach((a, i) => cols[i % 4].push(a))

    return (
        <section className="news-section">
            {/* — Secondary featured row — */}
            <div className="section-rule">
                <span className="section-label">Top Stories</span>
                <div className="section-rule-line" />
            </div>
            <div className="secondary-row">
                {secondary.map((article, i) => (
                    <div key={article.url || i} className="sec-col">
                        <ArticleCard article={article} showImage={true} />
                    </div>
                ))}
            </div>

            {/* — 4-column newspaper grid — */}
            {grid.length > 0 && (
                <>
                    <div className="section-rule">
                        <span className="section-label">More News</span>
                        <div className="section-rule-line" />
                    </div>
                    <div className="paper-grid">
                        {cols.map((colArticles, ci) => (
                            <div key={ci} className="paper-col">
                                {colArticles.map((article, i) => (
                                    <ArticleCard
                                        key={article.url || i}
                                        article={article}
                                        showImage={i === 0}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    )
}

export default NewsGrid
