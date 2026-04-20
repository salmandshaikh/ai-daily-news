import { useState, useEffect } from 'react'
import Header from './components/Header'
import HeroArticle from './components/HeroArticle'
import NewsGrid from './components/NewsGrid'
import PodcastPlayer from './components/PodcastPlayer'

function App() {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
    const [newsData, setNewsData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeSection, setActiveSection] = useState('All')

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    useEffect(() => {
        fetch(`data/news.json?t=${Date.now()}`)
            .then(r => r.json())
            .then(d => { setNewsData(d); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    const toggleTheme = () => setTheme(p => p === 'light' ? 'dark' : 'light')

    const articles = newsData?.articles || []
    const hero = articles[0]
    const rest = articles.slice(1)

    return (
        <div className="app">
            <Header
                theme={theme}
                toggleTheme={toggleTheme}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
            />

            <main>
                <div className="container">
                    {loading ? (
                        <div style={{ padding: '40px 0' }}>
                            <div className="skeleton" style={{ height: 380, marginBottom: 24 }} />
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="skeleton" style={{ height: 220 }} />
                                ))}
                            </div>
                        </div>
                    ) : hero ? (
                        <>
                            <div style={{
                                fontFamily: 'var(--sans)', fontSize: 10, color: 'var(--ink-3)',
                                textTransform: 'uppercase', letterSpacing: '0.8px',
                                padding: '8px 0', borderBottom: '1px solid var(--rule-light)'
                            }}>
                                Edition of {new Date(newsData.updated).toLocaleString('en-US', {
                                    weekday: 'long', month: 'long', day: 'numeric',
                                    year: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </div>
                            <HeroArticle article={hero} />
                            <NewsGrid articles={rest} />
                        </>
                    ) : (
                        <div style={{
                            textAlign: 'center', padding: '80px 0',
                            fontFamily: 'var(--serif)', fontSize: 20, color: 'var(--ink-3)'
                        }}>
                            No articles available at this time.
                        </div>
                    )}
                </div>
            </main>

            <footer className="site-footer">
                <div className="container">
                    <div className="footer-logo">AI Daily News</div>
                    <div className="footer-copy">
                        © {new Date().getFullYear()} AI Daily News &nbsp;·&nbsp; Powered by Groq &amp; OpenRouter &nbsp;·&nbsp; Updated every 4 hours
                    </div>
                </div>
            </footer>

            {newsData?.podcast && <PodcastPlayer podcast={newsData.podcast} />}
        </div>
    )
}

export default App
