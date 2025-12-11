import { useState, useEffect } from 'react'
import Header from './components/Header'
import HeroArticle from './components/HeroArticle'
import NewsGrid from './components/NewsGrid'
import PodcastPlayer from './components/PodcastPlayer'

function App() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light'
    })
    const [newsData, setNewsData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    useEffect(() => {
        // Fetch news data with cache busting
        fetch(`data/news.json?t=${new Date().getTime()}`)
            .then(response => response.json())
            .then(data => {
                setNewsData(data)
                setLoading(false)
            })
            .catch(error => {
                console.error('Error loading news:', error)
                setLoading(false)
            })
    }, [])

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    return (
        <div className="app">
            <Header theme={theme} toggleTheme={toggleTheme} />

            <main style={{ flex: 1, paddingTop: '80px', paddingBottom: '60px' }}>
                <div className="container">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <div className="skeleton" style={{ height: '400px', borderRadius: '16px', marginBottom: '24px' }}></div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="skeleton" style={{ height: '300px', borderRadius: '16px' }}></div>
                                ))}
                            </div>
                        </div>
                    ) : newsData && newsData.articles && newsData.articles.length > 0 ? (
                        <>
                            <div style={{
                                fontSize: '14px',
                                color: 'var(--text-secondary)',
                                marginBottom: '32px',
                                borderBottom: '1px solid var(--border)',
                                paddingBottom: '12px'
                            }}>
                                Last updated: {new Date(newsData.updated).toLocaleString()}
                            </div>

                            {/* Podcast Player */}
                            {newsData.podcast && <PodcastPlayer podcast={newsData.podcast} />}

                            <HeroArticle article={newsData.articles[0]} />
                            <NewsGrid articles={newsData.articles.slice(1)} />
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
                            No news articles available.
                        </div>
                    )}
                </div>
            </main>

            <footer style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '24px 0',
                textAlign: 'center',
                fontSize: '14px',
                color: 'var(--text-secondary)',
                borderTop: '1px solid var(--border)'
            }}>
                <div className="container">
                    © 2025 AI Daily News. Powered by Groq & OpenRouter.
                </div>
            </footer>
        </div>
    )
}

export default App
