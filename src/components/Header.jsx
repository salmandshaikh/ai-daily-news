import { Moon, Sun } from 'lucide-react'

const STOCKS = [
    { sym: 'NVDA',  price: '875.40', pct: '+1.43%', up: true  },
    { sym: 'AAPL',  price: '172.30', pct: '-0.49%', up: false },
    { sym: 'MSFT',  price: '421.50', pct: '+0.77%', up: true  },
    { sym: 'GOOGL', price: '156.78', pct: '+0.72%', up: true  },
    { sym: 'META',  price: '516.90', pct: '-0.83%', up: false },
    { sym: 'AMZN',  price: '185.20', pct: '+1.15%', up: true  },
    { sym: 'TSLA',  price: '175.60', pct: '-3.41%', up: false },
    { sym: 'AMD',   price: '168.45', pct: '+2.78%', up: true  },
    { sym: 'INTC',  price: '31.20',  pct: '-1.42%', up: false },
    { sym: 'CRM',   price: '282.15', pct: '+0.70%', up: true  },
    { sym: 'PLTR',  price: '22.80',  pct: '+1.78%', up: true  },
    { sym: 'AI',    price: '26.50',  pct: '+2.91%', up: true  },
    { sym: 'SOUN',  price: '8.40',   pct: '+4.10%', up: true  },
    { sym: 'BBAI',  price: '3.15',   pct: '-2.20%', up: false },
]

const NAV_LINKS = ['All', 'Technology', 'Research', 'Business', 'Science', 'Opinion']

function StockTicker() {
    const doubled = [...STOCKS, ...STOCKS]
    return (
        <div className="ticker-bar">
            <div className="ticker-badge">Markets</div>
            <div className="ticker-scroll-wrap">
                <div className="ticker-track">
                    {doubled.map((s, i) => (
                        <div key={i} className="ticker-item">
                            <span className="t-sym">{s.sym}</span>
                            <span className="t-price">{s.price}</span>
                            <span className={s.up ? 't-up' : 't-dn'}>{s.pct}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function Header({ theme, toggleTheme, activeSection, setActiveSection }) {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    })

    return (
        <header className="site-header">
            <StockTicker />
            <div className="masthead-top container">
                <span className="masthead-date">{today}</span>
                <div className="masthead-logo">AI Daily News</div>
                <div className="masthead-actions">
                    <button className="masthead-btn" onClick={toggleTheme}>
                        {theme === 'light' ? <Moon size={13} /> : <Sun size={13} />}
                        {theme === 'light' ? 'Dark' : 'Light'}
                    </button>
                </div>
            </div>
            <nav className="site-nav">
                {NAV_LINKS.map(link => (
                    <div
                        key={link}
                        className={`nav-link${activeSection === link ? ' active' : ''}`}
                        onClick={() => setActiveSection(link)}
                    >
                        {link}
                    </div>
                ))}
            </nav>
        </header>
    )
}

export default Header
