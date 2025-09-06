import React from 'react'
import { Briefcase, Calendar, MapPin, Award, TrendingUp } from 'lucide-react'

const Experiences = ({ experiences }) => {
  return (
    <section id="experiences" className="py-20 bg-gradient-to-br from-white via-gray-50 to-teal-50 w-full relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 left-10 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-40 right-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x bg-size-200">
              Experiences
            </span>
          </h2>
          <p className="text-gray-600 text-xl sm:text-2xl md:text-3xl max-w-4xl mx-auto leading-relaxed">
            My professional journey and the experiences that shaped my career.
          </p>
        </div>

        {experiences && experiences.length > 0 ? (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-400 to-blue-500 hidden lg:block animate-fade-in-up"></div>
            
            <div className="space-y-12">
              {experiences.map((experience, index) => (
                <div 
                  key={index} 
                  className="relative animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex gap-8 group">
                    {/* Timeline Dot */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl z-10 relative group-hover:scale-110 transition-transform duration-300">
                        <Briefcase className="text-white animate-bounce-slow" size={28} />
                      </div>
                      {/* Pulse Effect */}
                      <div className="absolute inset-0 w-16 h-16 bg-teal-400 rounded-full animate-ping opacity-20"></div>
                    </div>

                    {/* Content Card */}
                    <div className="flex-grow">
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 card-hover">
                        {/* Header */}
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                          <div className="flex-grow">
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors duration-300">
                              {experience.title}
                            </h3>
                            <h4 className="text-xl sm:text-2xl md:text-3xl font-semibold text-teal-600 mb-4 flex items-center gap-2">
                              <Award className="animate-spin-slow" size={24} />
                              {experience.company}
                            </h4>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-lg text-gray-500 lg:text-right">
                            {experience.duration && (
                              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                                <Calendar size={18} className="text-teal-600" />
                                <span className="font-medium">{experience.duration}</span>
                              </div>
                            )}
                            {experience.location && (
                              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                                <MapPin size={18} className="text-blue-600" />
                                <span className="font-medium">{experience.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Description */}
                        {experience.description && (
                          <div className="mb-6">
                            <p className="text-gray-700 text-lg sm:text-xl leading-relaxed">
                              {experience.description}
                            </p>
                          </div>
                        )}

                        {/* Skills/Technologies */}
                        {experience.skills && experience.skills.length > 0 && (
                          <div className="flex flex-wrap gap-3">
                            {experience.skills.map((skill, skillIndex) => (
                              <span 
                                key={skillIndex}
                                className="group/skill px-4 py-2 bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 text-base sm:text-lg rounded-full font-medium hover:from-teal-200 hover:to-blue-200 transition-all duration-300 transform hover:scale-110 cursor-default"
                              >
                                <TrendingUp className="inline mr-1 group-hover/skill:animate-bounce" size={16} />
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
              <Briefcase className="text-gray-400" size={48} />
            </div>
            <p className="text-gray-500 text-2xl">No experiences available yet.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Experiences
