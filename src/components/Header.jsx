import { Moon, Sun, Menu, X } from 'lucide-react'
import { useState } from 'react'

function Header({ theme, toggleTheme }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

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

                {/* Desktop Navigation */}
                <nav className="desktop-nav" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '32px'
                }}>
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

                {/* Mobile Menu Button */}
                <div className="mobile-nav-toggle" style={{ display: 'none' }}>
                    <button
                        onClick={toggleMobileMenu}
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
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className="mobile-menu"
                style={{
                    position: 'fixed',
                    top: '70px',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'var(--bg-card)',
                    backdropFilter: 'blur(20px)',
                    transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'none',
                    flexDirection: 'column',
                    padding: '24px',
                    gap: '16px',
                    zIndex: 999
                }}
            >
                <ul style={{
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    {['Home', 'Technology', 'Research', 'Business'].map(item => (
                        <li key={item}>
                            <a
                                href="#"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{
                                    color: 'var(--text-primary)',
                                    textDecoration: 'none',
                                    fontWeight: '600',
                                    fontSize: '18px',
                                    padding: '16px',
                                    display: 'block',
                                    borderRadius: '12px',
                                    transition: 'all 0.3s ease',
                                    backgroundColor: 'transparent'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'var(--bg-secondary)'
                                    e.target.style.color = 'var(--accent)'
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent'
                                    e.target.style.color = 'var(--text-primary)'
                                }}
                            >
                                {item}
                            </a>
                        </li>
                    ))}
                </ul>

                <button
                    onClick={() => {
                        toggleTheme()
                        setMobileMenuOpen(false)
                    }}
                    style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        color: 'var(--text-primary)',
                        fontSize: '16px',
                        fontWeight: '600'
                    }}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    <span>Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode</span>
                </button>
            </div>

            <style>{`
                /* Mobile Responsive Styles */
                @media (max-width: 767px) {
                    .desktop-nav {
                        display: none !important;
                    }
                    .mobile-nav-toggle {
                        display: flex !important;
                    }
                    .mobile-menu {
                        display: flex !important;
                    }
                }

                @media (min-width: 768px) {
                    .mobile-menu {
                        display: none !important;
                    }
                }
            `}</style>
        </header>
    )
}

export default Header
