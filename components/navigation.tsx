"use client"
import { useState } from 'react'

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-logo">
          <span className="text-xl font-bold text-blue-600">HanJaemi</span>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links">
          <a href="#solutions" className="nav-link">Solutions</a>
          <a href="#benefits" className="nav-link">Benefits</a>
          <a href="#how-it-works" className="nav-link">How it Works</a>
          <a href="#integrations" className="nav-link">Integrations</a>
          <a href="#faqs" className="nav-link">FAQs</a>
          <a href="#pricing" className="nav-link-special">Pricing</a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
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

      {/* Mobile Menu with transition */}
      <div className={`mobile-menu transform transition-transform duration-200 ease-in-out ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full md:hidden'}`}>
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
