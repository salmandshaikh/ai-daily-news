import { Moon, Sun, Menu, X, ExternalLink } from 'lucide-react'
import { useState } from 'react'

const navItems = [
    { label: 'Latest', href: '#latest' },
    { label: 'Research', href: '#research' },
    { label: 'Technology', href: '#technology' },
    { label: 'About', href: '#about' },
]

function Header({ theme, toggleTheme }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

    return (
        <header className="site-header">
            <div className="container header-inner">
                {/* Logo */}
                <a href="#" className="site-logo" aria-label="AI Daily News - Home">
                    <span className="logo-mark">
                        <span className="logo-dot"></span>
                    </span>
                    <span className="logo-text">
                        AI Daily News
                    </span>
                </a>

                {/* Desktop Navigation */}
                <nav className="desktop-nav" aria-label="Primary navigation">
                    <ul className="nav-list">
                        {navItems.map(item => (
                            <li key={item.label}>
                                <a href={item.href} className="nav-link">{item.label}</a>
                            </li>
                        ))}
                    </ul>

                    <div className="header-actions">
                        <button
                            onClick={toggleTheme}
                            className="theme-toggle"
                            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>

                        <a
                            href="mailto:contact@example.com"
                            className="cta-button"
                            aria-label="Contact for partnerships or investment"
                        >
                            Partner with us
                            <ExternalLink size={14} />
                        </a>
                    </div>
                </nav>

                {/* Mobile Menu Button */}
                <div className="mobile-nav-toggle">
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle"
                        aria-label="Toggle theme"
                        style={{ marginRight: '8px' }}
                    >
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                    <button
                        onClick={toggleMobileMenu}
                        className="hamburger"
                        aria-label="Toggle mobile menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu${mobileMenuOpen ? ' open' : ''}`} aria-hidden={!mobileMenuOpen}>
                <ul className="mobile-nav-list">
                    {navItems.map(item => (
                        <li key={item.label}>
                            <a
                                href={item.href}
                                className="mobile-nav-link"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
                <a
                    href="mailto:contact@example.com"
                    className="cta-button mobile-cta"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    Partner with us
                    <ExternalLink size={14} />
                </a>
            </div>
        </header>
    )
}

export default Header
