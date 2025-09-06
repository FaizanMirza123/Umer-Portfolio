import React from "react";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Heart,
  ArrowUp,
  Sparkles,
} from "lucide-react";

const Footer = ({ settings }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Use settings data or fallback to defaults
  const socialLinks = {
    email: settings?.email || "umer.saeed@example.com",
    github: settings?.github_url || "https://github.com",
    linkedin: settings?.linkedin_url || "https://linkedin.com",
    twitter: settings?.twitter_url || "https://twitter.com",
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-black dark:via-gray-900 dark:to-gray-800 text-white py-16 w-full relative overflow-hidden transition-colors duration-300">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-20 w-64 h-64 bg-teal-500/10 dark:bg-teal-400/10 rounded-full blur-xl animate-blob"></div>
        <div className="absolute bottom-10 left-20 w-64 h-64 bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/5 dark:bg-purple-400/5 rounded-full blur-2xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Content */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="group w-24 h-24 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl hover:shadow-teal-500/25 transition-all duration-500 transform hover:scale-110 relative overflow-hidden">
            <span className="text-white font-bold text-3xl group-hover:scale-110 transition-transform duration-300 relative z-10">
              US
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            <Sparkles
              className="absolute top-2 right-2 text-white/70 animate-pulse"
              size={16}
            />
          </div>

          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-teal-200 to-blue-200 bg-clip-text text-transparent animate-gradient-x bg-size-200">
            Let's Connect & Create Magic
          </h3>
          <p className="text-gray-300 dark:text-gray-400 mb-8 max-w-3xl mx-auto text-xl md:text-2xl leading-relaxed animate-fade-in-up animation-delay-300">
            I'm always interested in new opportunities and collaborations. Feel
            free to reach out if you'd like to work together and build something
            amazing!
          </p>

          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-12 animate-fade-in-up animation-delay-600">
            <a
              href={`mailto:${socialLinks.email}`}
              className="group w-16 h-16 bg-gray-800/50 dark:bg-gray-700/50 backdrop-blur-sm hover:bg-gradient-to-br hover:from-teal-600 hover:to-blue-600 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:scale-125 hover:-translate-y-2 border border-gray-700 dark:border-gray-600 hover:border-transparent"
              title="Email"
            >
              <Mail
                size={28}
                className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300"
              />
            </a>
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-16 h-16 bg-gray-800/50 dark:bg-gray-700/50 backdrop-blur-sm hover:bg-gradient-to-br hover:from-gray-700 hover:to-gray-900 dark:hover:from-gray-600 dark:hover:to-gray-800 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:scale-125 hover:-translate-y-2 border border-gray-700 dark:border-gray-600 hover:border-transparent"
              title="GitHub"
            >
              <Github
                size={28}
                className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300"
              />
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-16 h-16 bg-gray-800/50 dark:bg-gray-700/50 backdrop-blur-sm hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-800 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:scale-125 hover:-translate-y-2 border border-gray-700 dark:border-gray-600 hover:border-transparent"
              title="LinkedIn"
            >
              <Linkedin
                size={28}
                className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300"
              />
            </a>
            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-16 h-16 bg-gray-800/50 dark:bg-gray-700/50 backdrop-blur-sm hover:bg-gradient-to-br hover:from-blue-400 hover:to-blue-600 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:scale-125 hover:-translate-y-2 border border-gray-700 dark:border-gray-600 hover:border-transparent"
              title="Twitter"
            >
              <Twitter
                size={28}
                className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300"
              />
            </a>
          </div>

          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-110 shadow-xl hover:shadow-2xl animate-fade-in-up animation-delay-900"
          >
            <ArrowUp
              size={20}
              className="group-hover:-translate-y-1 transition-transform duration-300"
            />
            Back to Top
            <Sparkles
              size={18}
              className="group-hover:animate-spin transition-transform duration-300"
            />
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 dark:border-gray-600 pt-8 text-center animate-fade-in-up animation-delay-1200">
          <p className="text-gray-400 dark:text-gray-500 text-lg md:text-xl flex items-center justify-center gap-2 flex-wrap">
            © 2025 Umer Saeed
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
