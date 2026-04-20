const FALLBACK = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop'

function ArticleCard({ article, showImage = true }) {
    const date = new Date(article.published || Date.now()).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    })

    const hasSummary = article.summary
        && article.summary !== 'Summary unavailable.'
        && !article.summary.startsWith('Error:')

    return (
        <div className="col-article">
            {showImage && article.image && (
                <img
                    src={article.image}
                    alt={article.title}
                    className="col-article-img"
                    loading="lazy"
                    onError={e => { e.target.src = FALLBACK }}
                />
            )}

            <div className="art-tag">{article.source_name || article.source}</div>

            <h3 className="art-hed">
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.title}
                </a>
            </h3>

            {hasSummary && (
                <p className="art-dek">{article.summary}</p>
            )}

            <div className="art-byline">{date}</div>
        </div>
    )
}

export default ArticleCard
