import React from "react";
import { Github, ExternalLink, Folder, Star, Eye } from "lucide-react";

const Projects = ({ projects }) => {
  return (
    <section
      id="projects"
      className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 w-full relative overflow-hidden transition-colors duration-300"
    >
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-100 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-100 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-black-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent animate-gradient-x bg-size-200">
              My Projects
            </span>
          </h2>
          <p className="text-black-600 dark:text-black-300 max-w-4xl mx-auto text-xl sm:text-2xl md:text-3xl leading-relaxed">
            I love to create things and I'm always working on something new! You
            can view some of my favorite projects below:
          </p>
        </div>

        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-teal-500/10 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Project Icon/Image */}
                <div className="mb-6 relative overflow-hidden rounded-xl">
                  {project.image ? (
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-xl transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                          <Star className="text-white" size={16} />
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                          <Eye className="text-white" size={16} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/50 dark:to-blue-900/50 rounded-xl flex items-center justify-center group-hover:from-teal-200 group-hover:to-blue-200 dark:group-hover:from-teal-800/50 dark:group-hover:to-blue-800/50 transition-all duration-300">
                      <Folder
                        className="text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform duration-300"
                        size={48}
                      />
                    </div>
                  )}
                </div>

                {/* Project Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">
                  {project.title}
                </h3>

                {/* Project Description */}
                <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl mb-6 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies */}
                {project.technologies && (
                  <div className="flex flex-wrap gap-3 mb-6">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200 text-sm md:text-base rounded-full font-medium hover:from-teal-100 hover:to-blue-100 dark:hover:from-teal-800/50 dark:hover:to-blue-800/50 hover:text-teal-700 dark:hover:text-teal-300 transition-all duration-300 transform hover:scale-105"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Links */}
                <div className="flex gap-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 text-lg font-semibold transition-all duration-300 transform hover:scale-110 group/link"
                    >
                      <Github
                        size={20}
                        className="group-hover/link:rotate-12 transition-transform duration-300"
                      />
                      GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 text-lg font-semibold transition-all duration-300 transform hover:scale-110 group/link"
                    >
                      <ExternalLink
                        size={20}
                        className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300"
                      />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
              <Folder className="text-gray-400 dark:text-gray-300" size={48} />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-2xl">
              No projects available yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
