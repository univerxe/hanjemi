"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const scrollToSection = (sectionId: string) => {
    try {
      const element = document.getElementById(sectionId);
      if (element) {
        // Fallback for browsers that don't support smooth scrolling
        if ('scrollBehavior' in document.documentElement.style) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          element.scrollIntoView();
        }
        setIsMobileMenuOpen(false);
      }
    } catch (error) {
      console.error('Error scrolling to section:', error);
    }
  };

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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  return (
    <nav className={`nav-container ${isScrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-content">
        <Link href="/" className="nav-logo">
          <Image
            src="/logov1_.png"
            alt="Hanjemi Logo"
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links">
          <a href="#solutions" className="nav-link" onClick={(e) => handleNavClick(e, 'solutions')}>Solutions</a>
          <a href="#benefits" className="nav-link" onClick={(e) => handleNavClick(e, 'benefits')}>Benefits</a>
          <a href="#how-it-works" className="nav-link" onClick={(e) => handleNavClick(e, 'how-it-works')}>How it Works</a>
          <a href="#integrations" className="nav-link" onClick={(e) => handleNavClick(e, 'integrations')}>Integrations</a>
          <a href="#faqs" className="nav-link" onClick={(e) => handleNavClick(e, 'faqs')}>FAQs</a>
          <a href="#pricing" className="nav-link" onClick={(e) => handleNavClick(e, 'pricing')}>Pricing</a>
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
        <a href="#solutions" className="mobile-link" onClick={(e) => handleNavClick(e, 'solutions')}>Solutions</a>
        <a href="#benefits" className="mobile-link" onClick={(e) => handleNavClick(e, 'benefits')}>Benefits</a>
        <a href="#how-it-works" className="mobile-link" onClick={(e) => handleNavClick(e, 'how-it-works')}>How it Works</a>
        <a href="#integrations" className="mobile-link" onClick={(e) => handleNavClick(e, 'integrations')}>Integrations</a>
        <a href="#faqs" className="mobile-link" onClick={(e) => handleNavClick(e, 'faqs')}>FAQs</a>
        <a href="#pricing" className="mobile-link" onClick={(e) => handleNavClick(e, 'pricing')}>Pricing</a>
        <div className="mobile-auth">
          <button className="nav-button-secondary w-full">Log in</button>
          <button className="nav-button-primary w-full">Sign up</button>
        </div>
      </div>
    </nav>
  )
}
