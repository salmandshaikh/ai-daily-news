import { Moon, Sun } from 'lucide-react'

function Header({ theme, toggleTheme }) {
    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: 'var(--bg-card)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border)',
            transition: 'all 0.3s ease'
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '70px'
            }}>
                <div style={{
                    fontSize: '28px',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.5px'
                }}>
                    AI Daily News
                </div>

                <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <ul style={{
                        display: 'flex',
                        listStyle: 'none',
                        gap: '24px',
                        margin: 0,
                        padding: 0
                    }}>
                        {['Home', 'Technology', 'Research', 'Business'].map(item => (
                            <li key={item}>
                                <a href="#" style={{
                                    color: 'var(--text-primary)',
                                    textDecoration: 'none',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    transition: 'color 0.2s ease',
                                    position: 'relative'
                                }} onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
                                    onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}>
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={toggleTheme}
                        style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            color: 'var(--text-primary)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1) rotate(15deg)'
                            e.currentTarget.style.borderColor = 'var(--accent)'
                            e.currentTarget.style.boxShadow = '0 4px 12px var(--glow)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
                            e.currentTarget.style.borderColor = 'var(--border)'
                            e.currentTarget.style.boxShadow = 'none'
                        }}
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                </nav>
            </div>
        </header>
    )
}

export default Header
