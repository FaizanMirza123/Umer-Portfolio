import React from 'react'
import { Github, ExternalLink } from 'lucide-react'

const FeaturedWork = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return (
      <section className="py-16 bg-gray-900 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-12">Featured Work</h2>
          <p className="text-gray-400">No featured projects available.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-900 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-12">Featured Work</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.slice(0, 3).map((project, index) => (
            <div key={index} className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              {/* Project Image */}
              <div className="h-48 bg-gray-700 overflow-hidden">
                {project.image ? (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-600 to-teal-800">
                    <span className="text-white text-4xl sm:text-6xl font-bold">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{project.title}</h3>
                <p className="text-gray-300 text-xs sm:text-sm mb-4 line-clamp-3">{project.description}</p>
                
                {/* Technologies */}
                {project.technologies && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="px-2 py-1 bg-teal-600 text-white text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-teal-400 hover:text-teal-300 text-xs sm:text-sm transition-colors"
                    >
                      <Github size={16} />
                      Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-teal-400 hover:text-teal-300 text-xs sm:text-sm transition-colors"
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedWork
