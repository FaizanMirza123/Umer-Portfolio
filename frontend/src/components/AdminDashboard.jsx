import React, { useState, useEffect } from 'react'
import { 
  LogOut, 
  User, 
  Briefcase, 
  Folder, 
  Star, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Upload,
  Eye,
  RefreshCw
} from 'lucide-react'
import { heroAPI, projectAPI, experienceAPI, portfolioAPI } from '../services/api'

const AdminDashboard = ({ portfolioData, setPortfolioData, onLogout }) => {
  const [activeTab, setActiveTab] = useState('hero')
  const [editMode, setEditMode] = useState(null)
  const [tempData, setTempData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: User },
    { id: 'featured', label: 'Featured Projects', icon: Star },
    { id: 'projects', label: 'All Projects', icon: Folder },
    { id: 'experiences', label: 'Experiences', icon: Briefcase }
  ]

  // Load fresh data when component mounts
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await portfolioAPI.getAll()
      setPortfolioData({
        hero: data.hero || portfolioData.hero,
        featured_projects: data.featured_projects || [],
        projects: data.projects || [],
        experiences: data.experiences || []
      })
    } catch (error) {
      setError('Failed to load data')
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (section, index = null) => {
    setEditMode({ section, index })
    if (section === 'hero') {
      setTempData({ ...portfolioData.hero })
    } else if (index !== null) {
      if (section === 'featured') {
        setTempData({ ...portfolioData.featured_projects[index] })
      } else {
        setTempData({ ...portfolioData[section][index] })
      }
    } else {
      // New item
      const defaultData = {
        featured: { title: '', description: '', image: '', github_url: '', live_url: '', technologies: [], is_featured: true },
        projects: { title: '', description: '', image: '', github_url: '', live_url: '', technologies: [], is_featured: false },
        experiences: { title: '', company: '', duration: '', location: '', description: '', skills: [] }
      }
      setTempData(defaultData[section] || {})
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')
    
    try {
      const { section, index } = editMode

      if (section === 'hero') {
        await heroAPI.createOrUpdate({
          name: tempData.name,
          title: tempData.title,
          description: tempData.description,
          profile_image: tempData.profile_image || tempData.profileImage
        })
      } else if (section === 'featured' || section === 'projects') {
        const projectData = {
          title: tempData.title,
          description: tempData.description,
          image: tempData.image,
          github_url: tempData.github_url || tempData.githubUrl,
          live_url: tempData.live_url || tempData.liveUrl,
          technologies: tempData.technologies || [],
          is_featured: section === 'featured' || tempData.is_featured
        }

        if (index !== null) {
          // Update existing
          const projectId = section === 'featured' 
            ? portfolioData.featured_projects[index].id
            : portfolioData.projects[index].id
          await projectAPI.update(projectId, projectData)
        } else {
          // Create new
          await projectAPI.create(projectData)
        }
      } else if (section === 'experiences') {
        const experienceData = {
          title: tempData.title,
          company: tempData.company,
          duration: tempData.duration,
          location: tempData.location,
          description: tempData.description,
          skills: tempData.skills || []
        }

        if (index !== null) {
          // Update existing
          await experienceAPI.update(portfolioData.experiences[index].id, experienceData)
        } else {
          // Create new
          await experienceAPI.create(experienceData)
        }
      }

      // Reload data to get fresh state
      await loadData()
      setEditMode(null)
      setTempData({})
    } catch (error) {
      setError('Failed to save data')
      console.error('Error saving:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (section, index) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return
    }

    setLoading(true)
    try {
      if (section === 'featured' || section === 'projects') {
        const projectId = section === 'featured' 
          ? portfolioData.featured_projects[index].id
          : portfolioData.projects[index].id
        await projectAPI.delete(projectId)
      } else if (section === 'experiences') {
        await experienceAPI.delete(portfolioData.experiences[index].id)
      }

      await loadData()
    } catch (error) {
      setError('Failed to delete item')
      console.error('Error deleting:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleArrayField = (field, value) => {
    setTempData({
      ...tempData,
      [field]: value.split(',').map(item => item.trim()).filter(item => item)
    })
  }

  const renderHeroEditor = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Hero Section</h3>
        <button 
          onClick={loadData}
          className="text-teal-600 hover:text-teal-700 flex items-center gap-1"
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>
      
      {editMode?.section === 'hero' ? (
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={tempData.name || ''}
              onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={tempData.title || ''}
              onChange={(e) => setTempData({ ...tempData, title: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={tempData.description || ''}
              onChange={(e) => setTempData({ ...tempData, description: e.target.value })}
              className="w-full p-2 border rounded-lg h-24"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Profile Image URL</label>
            <input
              type="url"
              value={tempData.profile_image || tempData.profileImage || ''}
              onChange={(e) => setTempData({ ...tempData, profile_image: e.target.value })}
              className="w-full p-2 border rounded-lg"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleSave} 
              disabled={loading}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
              Save
            </button>
            <button onClick={() => setEditMode(null)} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-medium">{portfolioData.hero?.name || 'No name'}</h4>
              <p className="text-gray-600">{portfolioData.hero?.title || 'No title'}</p>
            </div>
            <button onClick={() => handleEdit('hero')} className="text-teal-600 hover:text-teal-700">
              <Edit size={16} />
            </button>
          </div>
          <p className="text-sm text-gray-700">{portfolioData.hero?.description || 'No description'}</p>
        </div>
      )}
    </div>
  )

  const renderProjectEditor = (section) => {
    const projects = section === 'featured' ? portfolioData.featured_projects : portfolioData.projects
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold capitalize">{section.replace('featured', 'Featured Projects')}</h3>
          <div className="flex gap-2">
            <button 
              onClick={loadData}
              className="text-teal-600 hover:text-teal-700 flex items-center gap-1"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button 
              onClick={() => handleEdit(section)}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={16} />
              Add Project
            </button>
          </div>
        </div>
        
        {editMode?.section === section && editMode?.index === null && (
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={tempData.title || ''}
                onChange={(e) => setTempData({ ...tempData, title: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={tempData.description || ''}
                onChange={(e) => setTempData({ ...tempData, description: e.target.value })}
                className="w-full p-2 border rounded-lg h-24"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <input
                type="url"
                value={tempData.image || ''}
                onChange={(e) => setTempData({ ...tempData, image: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">GitHub URL</label>
              <input
                type="url"
                value={tempData.github_url || tempData.githubUrl || ''}
                onChange={(e) => setTempData({ ...tempData, github_url: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Live URL</label>
              <input
                type="url"
                value={tempData.live_url || tempData.liveUrl || ''}
                onChange={(e) => setTempData({ ...tempData, live_url: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
              <input
                type="text"
                value={tempData.technologies ? tempData.technologies.join(', ') : ''}
                onChange={(e) => handleArrayField('technologies', e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="React, Node.js, MongoDB"
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleSave} 
                disabled={loading}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                Save
              </button>
              <button onClick={() => setEditMode(null)} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {projects?.map((project, index) => (
            <div key={project.id || index} className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{project.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  {project.technologies && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="px-2 py-1 bg-gray-100 text-xs rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(section, index)} className="text-teal-600 hover:text-teal-700">
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(section, index)} 
                    className="text-red-600 hover:text-red-700"
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {(!projects || projects.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              No projects found. Add your first project above.
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderExperienceEditor = () => {
    const experiences = portfolioData.experiences || []
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Experiences</h3>
          <div className="flex gap-2">
            <button 
              onClick={loadData}
              className="text-teal-600 hover:text-teal-700 flex items-center gap-1"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button 
              onClick={() => handleEdit('experiences')}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={16} />
              Add Experience
            </button>
          </div>
        </div>
        
        {editMode?.section === 'experiences' && editMode?.index === null && (
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Job Title</label>
                <input
                  type="text"
                  value={tempData.title || ''}
                  onChange={(e) => setTempData({ ...tempData, title: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <input
                  type="text"
                  value={tempData.company || ''}
                  onChange={(e) => setTempData({ ...tempData, company: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <input
                  type="text"
                  value={tempData.duration || ''}
                  onChange={(e) => setTempData({ ...tempData, duration: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Jan 2023 - Present"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={tempData.location || ''}
                  onChange={(e) => setTempData({ ...tempData, location: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="New York, NY"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={tempData.description || ''}
                onChange={(e) => setTempData({ ...tempData, description: e.target.value })}
                className="w-full p-2 border rounded-lg h-24"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Skills (comma-separated)</label>
              <input
                type="text"
                value={tempData.skills ? tempData.skills.join(', ') : ''}
                onChange={(e) => handleArrayField('skills', e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="JavaScript, React, Node.js"
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleSave} 
                disabled={loading}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                Save
              </button>
              <button onClick={() => setEditMode(null)} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {experiences.map((experience, index) => (
            <div key={experience.id || index} className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{experience.title}</h4>
                  <p className="text-teal-600">{experience.company}</p>
                  <p className="text-sm text-gray-500">{experience.duration} • {experience.location}</p>
                  <p className="text-sm text-gray-600 mt-1">{experience.description}</p>
                  {experience.skills && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {experience.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="px-2 py-1 bg-gray-100 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit('experiences', index)} className="text-teal-600 hover:text-teal-700">
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete('experiences', index)} 
                    className="text-red-600 hover:text-red-700"
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {experiences.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No experiences found. Add your first experience above.
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-teal-500 text-white font-bold text-sm flex items-center justify-center rounded">
                US
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Eye size={16} />
                View Site
              </a>
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button 
              onClick={() => setError('')}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-teal-100 text-teal-700 border-l-4 border-teal-500'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'hero' && renderHeroEditor()}
            {activeTab === 'featured' && renderProjectEditor('featured')}
            {activeTab === 'projects' && renderProjectEditor('projects')}
            {activeTab === 'experiences' && renderExperienceEditor()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
