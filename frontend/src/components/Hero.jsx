import React from 'react'
import { User, ArrowDown, Sparkles } from 'lucide-react'

const Hero = ({ data }) => {
  // Debug log to see what data is being received
  console.log('Hero component received data:', data)
  console.log('Profile image value:', data?.profileImage || data?.profile_image)
  
  // Fallback data in case data is not provided
  const heroData = data || {
    name: 'Umer Saeed',
    title: 'Full Stack Developer',
    description: "Hey, I'm Umer Saeed. Here, you can check out what I'm working on. I try my best to create things with code.",
    profileImage: null
  }

  // Check both camelCase and snake_case for image
  const profileImage = heroData.profileImage || heroData.profile_image

  return (
    <section className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-gray-50 via-white to-teal-50 w-full relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 w-full">
        {/* Welcome Badge */}
        <div className="mb-8 animate-fade-in-down">
          <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 rounded-full text-lg font-medium shadow-lg animate-pulse">
            <Sparkles className="mr-2 animate-spin-slow" size={20} />
            Welcome to my digital space
          </span>
        </div>

        {/* Profile Image */}
        <div className="mb-12 animate-fade-in-up animation-delay-300">
          <div className="relative group">
            <div className="absolute -inset-6 bg-white from-teal-400 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 mx-auto rounded-full overflow-hidden bg-gray-200 border-6 border-white shadow-2xl transform group-hover:scale-105 transition-all duration-500">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt={heroData.name}
                  className="w-full h-full object-cover rounded-full border-8 border-black"
                  onError={(e) => {
                    console.log('Image failed to load:', profileImage)
                    e.target.style.display = 'none'
                  }}
                  onLoad={() => console.log('Image loaded successfully:', profileImage)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-400 to-teal-600 text-white">
                  <User size={120} className="animate-bounce-slow" />
                </div>
              )}
              
              {/* Fallback icon that shows if image fails to load */}
          
            </div>
          </div>
        </div>

        {/* Name and Title */}
        <div className="mb-12 animate-fade-in-up animation-delay-600">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-gray-900 mb-6 leading-tight">
            Hey, I'm{' '}
            <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x bg-size-200">
              {heroData.name}
            </span>
          </h1>
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-gray-600 mb-8 font-medium animate-type-writer">
            {heroData.title}
          </p>
        </div>

        {/* Description */}
        <div className="max-w-6xl mx-auto mb-12 animate-fade-in-up animation-delay-900">
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-700 leading-relaxed font-light">
            {heroData.description}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in-up animation-delay-1200">
          <a 
            href="#projects" 
            className="group inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold rounded-full hover:from-teal-700 hover:to-blue-700 transform hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl text-xl"
          >
            Explore My Work
            <ArrowDown className="ml-3 group-hover:translate-y-1 transition-transform duration-300" size={24} />
          </a>
          <a 
            href="#contact" 
            className="inline-flex items-center justify-center px-10 py-5 border-3 border-teal-600 text-teal-600 font-bold rounded-full hover:bg-teal-600 hover:text-white transform hover:scale-110 transition-all duration-300 text-xl"
          >
            Let's Connect
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="animate-bounce">
          <div className="flex flex-col items-center text-gray-400">
            <span className="text-lg mb-3 font-medium">Discover more</span>
            <div className="w-8 h-12 border-3 border-gray-300 rounded-full flex justify-center animate-pulse">
              <div className="w-2 h-4 bg-teal-500 rounded-full mt-2 animate-ping"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
