"use client"
import { useState, useEffect } from 'react'

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isMobileMenuOpen && !target.closest('.nav-container')) {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMobileMenuOpen])

  return (
    <nav className={`nav-container ${isScrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-content">
        <div className="nav-logo">
          <svg 
            className="h-8 w-8 text-blue-600" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span className="text-xl font-bold text-blue-600 ml-2">HanJaemi</span>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links">
          <a href="#solutions" className="nav-link">Solutions</a>
          <a href="#benefits" className="nav-link">Benefits</a>
          <a href="#how-it-works" className="nav-link">How it Works</a>
          <a href="#integrations" className="nav-link">Integrations</a>
          <a href="#faqs" className="nav-link">FAQs</a>
          <a href="#pricing" className="nav-link">Pricing</a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors" // Changed from md:hidden to lg:hidden
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Auth Buttons */}
        <div className="nav-auth">
          <button className="nav-button-secondary">Log in</button>
          <button className="nav-button-primary">Sign up</button>
        </div>
      </div>

      {/* Mobile Menu with improved transition */}
      <div 
        className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <a href="#solutions" className="mobile-link">Solutions</a>
        <a href="#benefits" className="mobile-link">Benefits</a>
        <a href="#how-it-works" className="mobile-link">How it Works</a>
        <a href="#integrations" className="mobile-link">Integrations</a>
        <a href="#faqs" className="mobile-link">FAQs</a>
        <a href="#pricing" className="mobile-link">Pricing</a>
        <div className="mobile-auth">
          <button className="nav-button-secondary w-full">Log in</button>
          <button className="nav-button-primary w-full">Sign up</button>
        </div>
      </div>
    </nav>
  )
}
