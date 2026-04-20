import { ArrowRight } from 'lucide-react'

const FALLBACK = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&h=600&fit=crop'

function HeroArticle({ article }) {
    if (!article) return null

    const date = new Date(article.published).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
    })

    const hasSummary = article.summary
        && article.summary !== 'Summary unavailable.'
        && !article.summary.startsWith('Error:')

    const bodyText = hasSummary
        ? article.summary
        : (article.description || article.title)

    return (
        <div className="hero-wrap">
            <div className="hero-img-col">
                <img
                    src={article.image || FALLBACK}
                    alt={article.title}
                    className="hero-img"
                    onError={e => { e.target.src = FALLBACK }}
                />
                <div className="hero-img-caption">
                    {article.source_name || article.source}
                </div>
            </div>

            <div className="hero-text-col">
                <div className="hero-eyebrow">Featured Story</div>

                <h1 className="hero-headline">
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                        {article.title}
                    </a>
                </h1>

                <p className="hero-deck">{bodyText}</p>

                <div className="hero-meta">
                    <span className="hero-source">{article.source_name || article.source}</span>
                    <span className="hero-sep">·</span>
                    <span>{date}</span>
                </div>

                <a href={article.url} target="_blank" rel="noopener noreferrer" className="hero-cta">
                    Read Full Story <ArrowRight size={11} />
                </a>
            </div>
        </div>
    )
}

export default HeroArticle
