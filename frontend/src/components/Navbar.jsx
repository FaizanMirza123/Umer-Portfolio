import React, { useState, useEffect } from 'react'
import { Mail, Menu, X, Sparkles, User } from 'lucide-react'

const Navbar = ({ onAdminClick }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  const handleContactClick = () => {
    window.location.href = 'mailto:umer.saeed@example.com'
  }

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false)
        } else {
          setIsVisible(true)
        }
        
        setIsScrolled(currentScrollY > 50)
        setLastScrollY(currentScrollY)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar)
      return () => {
        window.removeEventListener('scroll', controlNavbar)
      }
    }
  }, [lastScrollY])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-md shadow-2xl border-b border-white/20' 
        : 'bg-white/95 backdrop-blur-md border-b border-gray-200'
    }`}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Navigation Links - Left Side */}
          <div className="flex items-center space-x-8">
            <div 
              className="group w-14 h-14 bg-gradient-to-br from-teal-500 to-blue-600 text-white font-bold text-xl flex items-center justify-center cursor-pointer hover:from-teal-600 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-110 rounded-xl relative overflow-hidden"
              onClick={onAdminClick}
            >
              <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">US</span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Sparkles className="absolute top-1 right-1 text-white/70 animate-pulse" size={12} />
            </div>
            
            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => scrollToSection('projects')}
                className="group relative text-gray-700 hover:text-teal-600 px-6 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10">Projects</span>
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-teal-500 to-blue-500 group-hover:w-full transition-all duration-300 rounded-full"></div>
                <div className="absolute inset-0 bg-teal-50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 opacity-0 group-hover:opacity-100"></div>
              </button>
              <button
                onClick={() => scrollToSection('experiences')}
                className="group relative text-gray-700 hover:text-teal-600 px-6 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10">Experiences</span>
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-teal-500 to-blue-500 group-hover:w-full transition-all duration-300 rounded-full"></div>
                <div className="absolute inset-0 bg-teal-50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 opacity-0 group-hover:opacity-100"></div>
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Contact Button */}
            <button
              onClick={handleContactClick}
              className="group bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold flex items-center gap-3 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-110 rounded-full relative overflow-hidden"
            >
              <Mail size={20} className="group-hover:rotate-12 transition-transform duration-300" />
              <span className="hidden sm:inline relative z-10">Contact Me</span>
              <span className="sm:hidden relative z-10">Contact</span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <div className="relative w-6 h-6">
                <Menu
                  size={24}
                  className={`absolute inset-0 transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'
                  }`}
                />
                <X
                  size={24}
                  className={`absolute inset-0 transition-all duration-300 ${
                    isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-0'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-6 space-y-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl mt-4 border border-gray-200">
            <button
              onClick={() => scrollToSection('projects')}
              className="group w-full text-left px-6 py-4 text-lg font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-all duration-300 rounded-xl mx-2"
            >
              <span className="flex items-center">
                Projects
                <div className="ml-2 w-0 h-0.5 bg-teal-500 group-hover:w-8 transition-all duration-300"></div>
              </span>
            </button>
            <button
              onClick={() => scrollToSection('experiences')}
              className="group w-full text-left px-6 py-4 text-lg font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-all duration-300 rounded-xl mx-2"
            >
              <span className="flex items-center">
                Experiences
                <div className="ml-2 w-0 h-0.5 bg-teal-500 group-hover:w-8 transition-all duration-300"></div>
              </span>
            </button>
            <button
              onClick={onAdminClick}
              className="flex items-center justify-center space-x-2 mx-6 mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg w-full"
            >
              <User size={18} />
              <span className="font-semibold">Admin Panel</span>
              <Sparkles size={16} className="animate-pulse" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
