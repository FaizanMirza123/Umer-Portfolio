import React, { useState, useEffect } from "react";
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
  RefreshCw,
  Settings,
  Palette,
  Type,
  Heart,
} from "lucide-react";
import {
  heroAPI,
  projectAPI,
  experienceAPI,
  portfolioAPI,
  settingsAPI,
} from "../services/api";
import ImageUpload from "./ImageUpload";

const AdminDashboard = ({ portfolioData, setPortfolioData, onLogout }) => {
  const [activeTab, setActiveTab] = useState("hero");
  const [editMode, setEditMode] = useState(null);
  const [tempData, setTempData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tabs = [
    { id: "hero", label: "Hero Section", icon: User },
    { id: "featured", label: "Featured Projects", icon: Star },
    { id: "projects", label: "All Projects", icon: Folder },
    { id: "experiences", label: "Experiences", icon: Briefcase },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Load fresh data when component mounts
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
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
      setError("Failed to load data");
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section, index = null) => {
    setEditMode({ section, index });
    if (section === "hero") {
      setTempData({ ...portfolioData.hero });
    } else if (index !== null) {
      let data;
      if (section === "featured") {
        data = { ...portfolioData.featured_projects[index] };
      } else {
        data = { ...portfolioData[section][index] };
      }

      // Convert arrays to strings for editing
      if (data.technologies && Array.isArray(data.technologies)) {
        data.technologies = data.technologies.join(", ");
      }
      if (data.skills && Array.isArray(data.skills)) {
        data.skills = data.skills.join(", ");
      }

      setTempData(data);
    } else {
      // New item
      const defaultData = {
        featured: {
          title: "",
          description: "",
          image: "",
          github_url: "",
          live_url: "",
          technologies: "",
          is_featured: true,
        },
        projects: {
          title: "",
          description: "",
          image: "",
          github_url: "",
          live_url: "",
          technologies: "",
          is_featured: false,
        },
        experiences: {
          title: "",
          company: "",
          duration: "",
          location: "",
          description: "",
          skills: "",
        },
      };
      setTempData(defaultData[section] || {});
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      const { section, index } = editMode;

      if (section === "hero") {
        await heroAPI.createOrUpdate({
          name: tempData.name,
          title: tempData.title,
          description: tempData.description,
          profile_image: tempData.profile_image || tempData.profileImage,
        });
      } else if (section === "featured" || section === "projects") {
        const projectData = {
          title: tempData.title,
          description: tempData.description,
          image: tempData.image,
          github_url: tempData.github_url || tempData.githubUrl,
          live_url: tempData.live_url || tempData.liveUrl,
          technologies: convertStringToArray(tempData.technologies),
          is_featured: section === "featured" || tempData.is_featured,
        };

        if (index !== null) {
          // Update existing
          const projectId =
            section === "featured"
              ? portfolioData.featured_projects[index].id
              : portfolioData.projects[index].id;
          await projectAPI.update(projectId, projectData);
        } else {
          // Create new
          await projectAPI.create(projectData);
        }
      } else if (section === "experiences") {
        const experienceData = {
          title: tempData.title,
          company: tempData.company,
          duration: tempData.duration,
          location: tempData.location,
          description: tempData.description,
          skills: convertStringToArray(tempData.skills),
        };

        if (index !== null) {
          // Update existing
          await experienceAPI.update(
            portfolioData.experiences[index].id,
            experienceData
          );
        } else {
          // Create new
          await experienceAPI.create(experienceData);
        }
      } else if (section === "settings") {
        const settingsData = {
          font_size: tempData.font_size,
          theme: tempData.theme,
          email: tempData.email,
          github_url: tempData.github_url,
          linkedin_url: tempData.linkedin_url,
          twitter_url: tempData.twitter_url,
        };
        await settingsAPI.update(settingsData);
      } // Reload data to get fresh state
      await loadData();
      setEditMode(null);
      setTempData({});
    } catch (error) {
      setError("Failed to save data");
      console.error("Error saving:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (section, index) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    setLoading(true);
    try {
      if (section === "featured" || section === "projects") {
        const projectId =
          section === "featured"
            ? portfolioData.featured_projects[index].id
            : portfolioData.projects[index].id;
        await projectAPI.delete(projectId);
      } else if (section === "experiences") {
        await experienceAPI.delete(portfolioData.experiences[index].id);
      }

      await loadData();
    } catch (error) {
      setError("Failed to delete item");
      console.error("Error deleting:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleArrayField = (field, value) => {
    // Store the raw string value, don't split immediately
    setTempData({
      ...tempData,
      [field]: value,
    });
  };

  const convertStringToArray = (value) => {
    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
    }
    return Array.isArray(value) ? value : [];
  };

  const handleToggleFeatured = async (projectId, currentFeaturedStatus) => {
    setLoading(true);
    try {
      await projectAPI.toggleFeatured(projectId);
      await loadData(); // Refresh data to see the change
    } catch (error) {
      setError("Failed to toggle featured status");
      console.error("Error toggling featured:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderHeroEditor = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-black">Hero Section</h3>
        <button
          onClick={loadData}
          className="text-teal-600 hover:text-teal-700 flex items-center gap-1"
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {editMode?.section === "hero" ? (
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-black text-left">
              Name
            </label>
            <input
              type="text"
              value={tempData.name || ""}
              onChange={(e) =>
                setTempData({ ...tempData, name: e.target.value })
              }
              className="w-full p-2 border rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black text-left">
              Title
            </label>
            <input
              type="text"
              value={tempData.title || ""}
              onChange={(e) =>
                setTempData({ ...tempData, title: e.target.value })
              }
              className="w-full p-2 border rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black text-left">
              Description
            </label>
            <textarea
              value={tempData.description || ""}
              onChange={(e) =>
                setTempData({ ...tempData, description: e.target.value })
              }
              className="w-full p-2 border rounded-lg text-black h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black text-left">
              Profile Image
            </label>
            <ImageUpload
              currentImage={
                tempData.profile_image || tempData.profileImage || ""
              }
              onImageChange={(url) =>
                setTempData({ ...tempData, profile_image: url })
              }
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Save
            </button>
            <button
              onClick={() => setEditMode(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex text-left mb-4">
            <div>
              <h4 className="font-medium text-black">
                {portfolioData.hero?.name || "No name"}
              </h4>
              <p className="text-black">
                {portfolioData.hero?.title || "No title"}
              </p>
            </div>
            <button
              onClick={() => handleEdit("hero")}
              className="text-teal-600 hover:text-teal-700"
            >
              <Edit size={16} />
            </button>
          </div>
          <p className="text-sm text-black text-left">
            {portfolioData.hero?.description || "No description"}
          </p>
        </div>
      )}
    </div>
  );

  const renderProjectEditor = (section) => {
    const projects =
      section === "featured"
        ? portfolioData.featured_projects
        : portfolioData.projects;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-black capitalize">
            {section.replace("featured", "Featured Projects")}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={loadData}
              className="text-teal-600 hover:text-teal-700 flex items-center gap-1"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
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
              <label className="block text-sm font-medium mb-2 text-black text-left">
                Title
              </label>
              <input
                type="text"
                value={tempData.title || ""}
                onChange={(e) =>
                  setTempData({ ...tempData, title: e.target.value })
                }
                className="w-full p-2 border rounded-lg text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-black text-left">
                Description
              </label>
              <textarea
                value={tempData.description || ""}
                onChange={(e) =>
                  setTempData({ ...tempData, description: e.target.value })
                }
                className="w-full p-2 border rounded-lg text-black h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-black text-left">
                Project Image
              </label>
              <ImageUpload
                currentImage={tempData.image || ""}
                onImageChange={(url) =>
                  setTempData({ ...tempData, image: url })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-black text-left">
                GitHub URL
              </label>
              <input
                type="url"
                value={tempData.github_url || tempData.githubUrl || ""}
                onChange={(e) =>
                  setTempData({ ...tempData, github_url: e.target.value })
                }
                className="w-full p-2 border rounded-lg text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-black text-left">
                Live URL
              </label>
              <input
                type="url"
                value={tempData.live_url || tempData.liveUrl || ""}
                onChange={(e) =>
                  setTempData({ ...tempData, live_url: e.target.value })
                }
                className="w-full p-2 border rounded-lg text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-black text-left">
                Technologies (comma-separated)
              </label>
              <input
                type="text"
                value={
                  typeof tempData.technologies === "string"
                    ? tempData.technologies
                    : Array.isArray(tempData.technologies)
                    ? tempData.technologies.join(", ")
                    : ""
                }
                onChange={(e) =>
                  handleArrayField("technologies", e.target.value)
                }
                className="w-full p-2 border rounded-lg text-black"
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Save
              </button>
              <button
                onClick={() => setEditMode(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {projects?.map((project, index) => (
            <div
              key={project.id || index}
              className="bg-white p-4 rounded-lg border"
            >
              {editMode?.section === section && editMode?.index === index ? (
                // Edit form for existing project
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black text-left">
                      Title
                    </label>
                    <input
                      type="text"
                      value={tempData.title || ""}
                      onChange={(e) =>
                        setTempData({ ...tempData, title: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-black text-left">
                      Description
                    </label>
                    <textarea
                      value={tempData.description || ""}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-lg text-black h-24"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-black text-left">
                      Project Image
                    </label>
                    <ImageUpload
                      currentImage={tempData.image || ""}
                      onImageChange={(url) =>
                        setTempData({ ...tempData, image: url })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-black text-left">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={tempData.github_url || tempData.githubUrl || ""}
                      onChange={(e) =>
                        setTempData({ ...tempData, github_url: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-black text-left">
                      Live URL
                    </label>
                    <input
                      type="url"
                      value={tempData.live_url || tempData.liveUrl || ""}
                      onChange={(e) =>
                        setTempData({ ...tempData, live_url: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-black text-left">
                      Technologies (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={
                        typeof tempData.technologies === "string"
                          ? tempData.technologies
                          : Array.isArray(tempData.technologies)
                          ? tempData.technologies.join(", ")
                          : ""
                      }
                      onChange={(e) =>
                        handleArrayField("technologies", e.target.value)
                      }
                      className="w-full p-2 border rounded-lg text-black"
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      Save
                    </button>
                    <button
                      onClick={() => setEditMode(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display project
                <div className="flex justify-between items-start text-left text-black">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{project.title}</h4>
                      {project.is_featured && (
                        <Star
                          className="text-yellow-500 fill-current"
                          size={16}
                        />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {project.description}
                    </p>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-gray-100 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() =>
                        handleToggleFeatured(project.id, project.is_featured)
                      }
                      className={`p-2 rounded-full transition-colors ${
                        project.is_featured
                          ? "text-yellow-500 hover:text-yellow-600 bg-yellow-50 hover:bg-yellow-100"
                          : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                      }`}
                      title={
                        project.is_featured
                          ? "Remove from featured"
                          : "Add to featured"
                      }
                      disabled={loading}
                    >
                      <Heart
                        size={16}
                        className={project.is_featured ? "fill-current" : ""}
                      />
                    </button>
                    <button
                      onClick={() => handleEdit(section, index)}
                      className="text-teal-600 hover:text-teal-700 p-2 rounded-full hover:bg-teal-50"
                      title="Edit project"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(section, index)}
                      className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                      disabled={loading}
                      title="Delete project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {(!projects || projects.length === 0) && (
            <div className="text-center py-8 text-black">
              No projects found. Add your first project above.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderExperienceEditor = () => {
    const experiences = portfolioData.experiences || [];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-black">Experiences</h3>
          <div className="flex gap-2">
            <button
              onClick={loadData}
              className="text-teal-600 hover:text-teal-700 flex items-center gap-1"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={() => handleEdit("experiences")}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={16} />
              Add Experience
            </button>
          </div>
        </div>

        {editMode?.section === "experiences" && editMode?.index === null && (
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-black text-left">
                  Job Title
                </label>
                <input
                  type="text"
                  value={tempData.title || ""}
                  onChange={(e) =>
                    setTempData({ ...tempData, title: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black text-left">
                  Company
                </label>
                <input
                  type="text"
                  value={tempData.company || ""}
                  onChange={(e) =>
                    setTempData({ ...tempData, company: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg text-black"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-black text-left">
                  Duration
                </label>
                <input
                  type="text"
                  value={tempData.duration || ""}
                  onChange={(e) =>
                    setTempData({ ...tempData, duration: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg text-black"
                  placeholder="Jan 2023 - Present"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black text-left">
                  Location
                </label>
                <input
                  type="text"
                  value={tempData.location || ""}
                  onChange={(e) =>
                    setTempData({ ...tempData, location: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg text-black"
                  placeholder="New York, NY"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-black text-left">
                Description
              </label>
              <textarea
                value={tempData.description || ""}
                onChange={(e) =>
                  setTempData({ ...tempData, description: e.target.value })
                }
                className="w-full p-2 border rounded-lg text-black h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-black text-left">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                value={
                  typeof tempData.skills === "string"
                    ? tempData.skills
                    : Array.isArray(tempData.skills)
                    ? tempData.skills.join(", ")
                    : ""
                }
                onChange={(e) => handleArrayField("skills", e.target.value)}
                className="w-full p-2 border rounded-lg text-black"
                placeholder="JavaScript, React, Node.js"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Save
              </button>
              <button
                onClick={() => setEditMode(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {experiences.map((experience, index) => (
            <div
              key={experience.id || index}
              className="bg-white p-4 rounded-lg border"
            >
              {editMode?.section === "experiences" &&
              editMode?.index === index ? (
                // Edit form for existing experience
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-black text-left">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={tempData.title || ""}
                        onChange={(e) =>
                          setTempData({ ...tempData, title: e.target.value })
                        }
                        className="w-full p-2 border rounded-lg text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-black text-left">
                        Company
                      </label>
                      <input
                        type="text"
                        value={tempData.company || ""}
                        onChange={(e) =>
                          setTempData({ ...tempData, company: e.target.value })
                        }
                        className="w-full p-2 border rounded-lg text-black"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-black text-left">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={tempData.duration || ""}
                        onChange={(e) =>
                          setTempData({ ...tempData, duration: e.target.value })
                        }
                        className="w-full p-2 border rounded-lg text-black"
                        placeholder="Jan 2023 - Present"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-black text-left">
                        Location
                      </label>
                      <input
                        type="text"
                        value={tempData.location || ""}
                        onChange={(e) =>
                          setTempData({ ...tempData, location: e.target.value })
                        }
                        className="w-full p-2 border rounded-lg text-black"
                        placeholder="New York, NY"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-black text-left">
                      Description
                    </label>
                    <textarea
                      value={tempData.description || ""}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-lg text-black h-24"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-black text-left">
                      Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={
                        typeof tempData.skills === "string"
                          ? tempData.skills
                          : Array.isArray(tempData.skills)
                          ? tempData.skills.join(", ")
                          : ""
                      }
                      onChange={(e) =>
                        handleArrayField("skills", e.target.value)
                      }
                      className="w-full p-2 border rounded-lg text-black"
                      placeholder="JavaScript, React, Node.js"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      Save
                    </button>
                    <button
                      onClick={() => setEditMode(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display experience
                <div className="flex text-left text-black">
                  <div>
                    <h4 className="font-medium">{experience.title}</h4>
                    <p className="text-teal-600">{experience.company}</p>
                    <p className="text-sm text-black">
                      {experience.duration} • {experience.location}
                    </p>
                    <p className="text-sm text-black mt-1">
                      {experience.description}
                    </p>
                    {experience.skills && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {experience.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 bg-gray-100 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit("experiences", index)}
                      className="text-teal-600 hover:text-teal-700"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete("experiences", index)}
                      className="text-red-600 hover:text-red-700"
                      disabled={loading}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {experiences.length === 0 && (
            <div className="text-center py-8 text-black">
              No experiences found. Add your first experience above.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSettingsEditor = () => (
    <div className="bg-black rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white dark:text-white flex items-center gap-2">
          <Settings size={20} />
          Website Settings
        </h2>
      </div>{" "}
      <div className="space-y-6 text-black">
        {/* Font Size Setting */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Type size={18} className="text-white" />
            <label
              htmlFor="font_size"
              className="block text-sm font-medium text-white"
            >
              Font Size
            </label>
          </div>
          <select
            id="font_size"
            value={
              editMode?.section === "settings"
                ? tempData.font_size
                : portfolioData.settings?.font_size || "medium"
            }
            onChange={(e) => {
              if (editMode?.section === "settings") {
                setTempData({ ...tempData, font_size: e.target.value });
              } else {
                handleEdit("settings");
                setTempData({
                  font_size: e.target.value,
                  theme: portfolioData.settings?.theme || "light",
                });
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extra-large">Extra Large</option>
          </select>
        </div>

        {/* Theme Setting */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette size={18} className="text-white" />
            <label
              htmlFor="theme"
              className="block text-sm font-medium text-white"
            >
              Theme
            </label>
          </div>
          <select
            id="theme"
            value={
              editMode?.section === "settings"
                ? tempData.theme
                : portfolioData.settings?.theme || "light"
            }
            onChange={(e) => {
              if (editMode?.section === "settings") {
                setTempData({ ...tempData, theme: e.target.value });
              } else {
                handleEdit("settings");
                setTempData({
                  font_size: portfolioData.settings?.font_size || "medium",
                  theme: e.target.value,
                });
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* Social Links Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white text-left border-b pb-2">
            Social Links
          </h3>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white text-left"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={
                editMode?.section === "settings"
                  ? tempData.email || ""
                  : portfolioData.settings?.email || ""
              }
              onChange={(e) => {
                if (editMode?.section === "settings") {
                  setTempData({ ...tempData, email: e.target.value });
                } else {
                  handleEdit("settings");
                  setTempData({
                    font_size: portfolioData.settings?.font_size || "medium",
                    theme: portfolioData.settings?.theme || "light",
                    email: e.target.value,
                    github_url: portfolioData.settings?.github_url || "",
                    linkedin_url: portfolioData.settings?.linkedin_url || "",
                    twitter_url: portfolioData.settings?.twitter_url || "",
                  });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>

          {/* GitHub URL */}
          <div className="space-y-2">
            <label
              htmlFor="github_url"
              className="block text-sm font-medium text-white text-left"
            >
              GitHub URL
            </label>
            <input
              type="url"
              id="github_url"
              value={
                editMode?.section === "settings"
                  ? tempData.github_url || ""
                  : portfolioData.settings?.github_url || ""
              }
              onChange={(e) => {
                if (editMode?.section === "settings") {
                  setTempData({ ...tempData, github_url: e.target.value });
                } else {
                  handleEdit("settings");
                  setTempData({
                    font_size: portfolioData.settings?.font_size || "medium",
                    theme: portfolioData.settings?.theme || "light",
                    email: portfolioData.settings?.email || "",
                    github_url: e.target.value,
                    linkedin_url: portfolioData.settings?.linkedin_url || "",
                    twitter_url: portfolioData.settings?.twitter_url || "",
                  });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="https://github.com/yourusername"
            />
          </div>

          {/* LinkedIn URL */}
          <div className="space-y-2">
            <label
              htmlFor="linkedin_url"
              className="block text-sm font-medium text-white text-left"
            >
              LinkedIn URL
            </label>
            <input
              type="url"
              id="linkedin_url"
              value={
                editMode?.section === "settings"
                  ? tempData.linkedin_url || ""
                  : portfolioData.settings?.linkedin_url || ""
              }
              onChange={(e) => {
                if (editMode?.section === "settings") {
                  setTempData({ ...tempData, linkedin_url: e.target.value });
                } else {
                  handleEdit("settings");
                  setTempData({
                    font_size: portfolioData.settings?.font_size || "medium",
                    theme: portfolioData.settings?.theme || "light",
                    email: portfolioData.settings?.email || "",
                    github_url: portfolioData.settings?.github_url || "",
                    linkedin_url: e.target.value,
                    twitter_url: portfolioData.settings?.twitter_url || "",
                  });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="https://linkedin.com/in/yourusername"
            />
          </div>

          {/* Twitter URL */}
          <div className="space-y-2">
            <label
              htmlFor="twitter_url"
              className="block text-sm font-medium text-white text-left"
            >
              Twitter URL
            </label>
            <input
              type="url"
              id="twitter_url"
              value={
                editMode?.section === "settings"
                  ? tempData.twitter_url || ""
                  : portfolioData.settings?.twitter_url || ""
              }
              onChange={(e) => {
                if (editMode?.section === "settings") {
                  setTempData({ ...tempData, twitter_url: e.target.value });
                } else {
                  handleEdit("settings");
                  setTempData({
                    font_size: portfolioData.settings?.font_size || "medium",
                    theme: portfolioData.settings?.theme || "light",
                    email: portfolioData.settings?.email || "",
                    github_url: portfolioData.settings?.github_url || "",
                    linkedin_url: portfolioData.settings?.linkedin_url || "",
                    twitter_url: e.target.value,
                  });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="https://twitter.com/yourusername"
            />
          </div>
        </div>

        {/* Save/Cancel buttons for settings */}
        {editMode?.section === "settings" && (
          <div className="flex gap-2 pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={16} />
              {loading ? "Saving..." : "Save Settings"}
            </button>
            <button
              onClick={() => {
                setEditMode(null);
                setTempData({});
              }}
              className="border border-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Current Settings Display */}
        <div className="bg-gray-50 rounded-lg p-4 mt-6">
          <h3 className="text-sm font-medium text-black mb-2">
            Current Settings
          </h3>
          <div className="text-sm text-black space-y-1">
            <div>
              Font Size:{" "}
              <span className="font-medium">
                {portfolioData.settings?.font_size || "medium"}
              </span>
            </div>
            <div>
              Theme:{" "}
              <span className="font-medium">
                {portfolioData.settings?.theme || "light"}
              </span>
            </div>
            <div>
              Email:{" "}
              <span className="font-medium">
                {portfolioData.settings?.email || "Not set"}
              </span>
            </div>
            <div>
              GitHub:{" "}
              <span className="font-medium">
                {portfolioData.settings?.github_url || "Not set"}
              </span>
            </div>
            <div>
              LinkedIn:{" "}
              <span className="font-medium">
                {portfolioData.settings?.linkedin_url || "Not set"}
              </span>
            </div>
            <div>
              Twitter:{" "}
              <span className="font-medium">
                {portfolioData.settings?.twitter_url || "Not set"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
              <h1 className="ml-3 text-xl font-semibold text-black">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="text-black hover:text-black flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  window.open("/", "_blank");
                }}
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
              onClick={() => setError("")}
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
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-teal-100 text-teal-700 border-l-4 border-teal-500"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "hero" && renderHeroEditor()}
            {activeTab === "featured" && renderProjectEditor("featured")}
            {activeTab === "projects" && renderProjectEditor("projects")}
            {activeTab === "experiences" && renderExperienceEditor()}
            {activeTab === "settings" && renderSettingsEditor()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
