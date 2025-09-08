import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token && token !== 'true') {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth endpoints
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },
}

// Portfolio data endpoints
export const portfolioAPI = {
  getAll: async () => {
    const response = await api.get('/')
    return response.data
  },
}

// Hero endpoints
export const heroAPI = {
  get: async () => {
    const response = await api.get('/hero')
    return response.data
  },
  
  createOrUpdate: async (heroData) => {
    const response = await api.post('/hero', heroData)
    return response.data
  },
}

// Project endpoints
export const projectAPI = {
  getAll: async (featuredOnly = false) => {
    const response = await api.get(`/projects?featured_only=${featuredOnly}`)
    return response.data
  },
  
  create: async (projectData) => {
    const response = await api.post('/projects', projectData)
    return response.data
  },
  
  update: async (projectId, projectData) => {
    const response = await api.put(`/projects/${projectId}`, projectData)
    return response.data
  },
  
  delete: async (projectId) => {
    const response = await api.delete(`/projects/${projectId}`)
    return response.data
  },
}

// Experience endpoints
export const experienceAPI = {
  getAll: async () => {
    const response = await api.get('/experiences')
    return response.data
  },
  
  create: async (experienceData) => {
    const response = await api.post('/experiences', experienceData)
    return response.data
  },
  
  update: async (experienceId, experienceData) => {
    const response = await api.put(`/experiences/${experienceId}`, experienceData)
    return response.data
  },
  
  delete: async (experienceId) => {
    const response = await api.delete(`/experiences/${experienceId}`)
    return response.data
  },
}

// Settings endpoints
export const settingsAPI = {
  get: async () => {
    const response = await api.get('/settings')
    return response.data
  },
  
  update: async (settingsData) => {
    const response = await api.put('/settings', settingsData)
    return response.data
  },
}

export default api
