import { useState, useEffect, use } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedWork from "./components/FeaturedWork";
import Projects from "./components/Projects";
import Experiences from "./components/Experiences";
import Footer from "./components/Footer";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import { portfolioAPI } from "./services/api";
import "./App.css";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [portfolioData, setPortfolioData] = useState({
    hero: {
      name: "Umer Saeed",
      title: "Full Stack Developer",
      description:
        "Hey, I'm Umer Saeed. Here, you can check out what I'm working on. I try my best to create things with code.",
      profileImage: null,
    },
    featured_projects: [],
    projects: [],
    experiences: [],
    settings: {
      font_size: "medium",
      theme: "light",
    },
  });
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken && adminToken !== "true") {
      setIsAdmin(true);
    }
  }, []);

  // Apply theme and font size classes to body
  useEffect(() => {
    const { theme, font_size } = portfolioData.settings;

    // Apply theme
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Apply font size
    const fontSizeClasses = [
      "font-small",
      "font-medium",
      "font-large",
      "font-extra-large",
    ];
    fontSizeClasses.forEach((cls) =>
      document.documentElement.classList.remove(cls)
    );

    if (font_size) {
      document.documentElement.classList.add(
        `font-${font_size.replace("-", "-")}`
      );
    }
  }, [portfolioData.settings]);

  const fetchPortfolioData = async () => {
    try {
      const data = await portfolioAPI.getAll();
      setPortfolioData({
        hero: data.hero || portfolioData.hero,
        featured_projects: data.featured_projects || [],
        projects: data.projects || [],
        experiences: data.experiences || [],
        settings: data.settings || { font_size: "medium", theme: "light" },
      });
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPortfolioData();
  }, []);
  // Fetch portfolio data on component mount

  const handleAdminLogin = (success, token) => {
    if (success && token) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      localStorage.setItem("adminToken", token);
      navigate("/admin");
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const PortfolioHome = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans w-full overflow-x-hidden transition-colors duration-300">
      <Navbar onAdminClick={() => navigate("/admin-login")} />
      <Hero data={portfolioData.hero} />
      <FeaturedWork projects={portfolioData.featured_projects} />
      <Projects projects={portfolioData.projects} />
      <Experiences experiences={portfolioData.experiences} />
      <Footer settings={portfolioData.settings} />
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black dark:text-black">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<PortfolioHome />} />
      <Route
        path="/admin-login"
        element={
          isAdmin ? (
            <Navigate to="/admin" replace />
          ) : (
            <AdminLogin
              onLogin={handleAdminLogin}
              onCancel={() => navigate("/")}
            />
          )
        }
      />
      <Route
        path="/admin"
        element={
          isAdmin ? (
            <AdminDashboard
              portfolioData={portfolioData}
              setPortfolioData={setPortfolioData}
              onLogout={handleAdminLogout}
            />
          ) : (
            <Navigate to="/admin-login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
