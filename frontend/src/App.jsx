import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturedWork from './components/FeaturedWork'
import Projects from './components/Projects'
import Experiences from './components/Experiences'
import Footer from './components/Footer'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import { portfolioAPI } from './services/api'
import './App.css'

function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [portfolioData, setPortfolioData] = useState({
    hero: {
      name: 'Umer Saeed',
      title: 'Full Stack Developer',
      description: "Hey, I'm Umer Saeed. Here, you can check out what I'm working on. I try my best to create things with code.",
      profileImage: null
    },
    featured_projects: [],
    projects: [],
    experiences: []
  })
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken && adminToken !== 'true') {
      setIsAdmin(true)
    }
  }, [])

  // Fetch portfolio data on component mount
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const data = await portfolioAPI.getAll()
        setPortfolioData({
          hero: data.hero || portfolioData.hero,
          featured_projects: data.featured_projects || [],
          projects: data.projects || [],
          experiences: data.experiences || []
        })
      } catch (error) {
        console.error('Error fetching portfolio data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolioData()
  }, [])

  const handleAdminLogin = (success, token) => {
    if (success && token) {
      setIsAdmin(true)
      setShowAdminLogin(false)
      localStorage.setItem('adminToken', token)
    }
  }

  const handleAdminLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem('adminToken')
  }

  if (showAdminLogin) {
    return <AdminLogin onLogin={handleAdminLogin} onCancel={() => setShowAdminLogin(false)} />
  }

  if (isAdmin) {
    return <AdminDashboard 
      portfolioData={portfolioData} 
      setPortfolioData={setPortfolioData}
      onLogout={handleAdminLogout} 
    />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans w-full overflow-x-hidden">
      <Navbar onAdminClick={() => setShowAdminLogin(true)} />
      <Hero data={portfolioData.hero} />
      <FeaturedWork projects={portfolioData.featured_projects} />
      <Projects projects={portfolioData.projects} />
      <Experiences experiences={portfolioData.experiences} />
      <Footer />
    </div>
  )
}

export default App
