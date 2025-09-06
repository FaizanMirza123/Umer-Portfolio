# Umer Saeed Portfolio Website

A full-stack portfolio website built with React, Tailwind CSS, FastAPI, and SQLite. The website features a clean, modern design similar to the provided reference image, with a complete admin dashboard for content management.

## 🌟 Features

### Frontend
- **Modern Design**: Clean, professional layout matching the reference design
- **Responsive**: Fully responsive design that works on all devices
- **Interactive Navigation**: Smooth scrolling navigation with fixed header
- **Hero Section**: Profile picture, name, title, and description
- **Featured Projects**: Showcase of top projects with images and links
- **Projects Gallery**: Complete list of all projects
- **Experience Timeline**: Professional experience with skills
- **Contact Integration**: Direct email links

### Admin Dashboard
- **Secure Login**: JWT-based authentication
- **Content Management**: 
  - Edit hero section (name, title, description, profile image)
  - Add/edit/delete projects with images, descriptions, technologies
  - Manage featured projects
  - Add/edit/delete work experiences
- **Real-time Updates**: Changes reflect immediately on the public site
- **User-friendly Interface**: Intuitive admin panel with form validation

### Backend API
- **FastAPI**: Modern, fast web framework for building APIs
- **SQLite Database**: Lightweight database for data persistence
- **JWT Authentication**: Secure admin authentication
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **RESTful Endpoints**: Clean API design with proper HTTP methods

## 🚀 Tech Stack

### Frontend
- **React 19**: Latest React with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and dev server
- **Axios**: HTTP client for API calls
- **Lucide React**: Beautiful icons

### Backend
- **FastAPI**: Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **SQLite**: Database
- **Pydantic**: Data validation
- **python-jose**: JWT tokens
- **passlib**: Password hashing
- **uvicorn**: ASGI server

## 📁 Project Structure

```
Umer-Portfolio/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── FeaturedWork.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Experiences.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── db.py
│   ├── config.py
│   └── requirements.txt
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the FastAPI server**
   ```bash
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`
   API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The website will be available at `http://localhost:5173`

## 🔑 Admin Access

### Default Credentials
- **Username**: `admin`
- **Password**: `admin123`

### Admin Features
1. **Login**: Click the "US" logo in the top-left corner
2. **Hero Management**: Edit personal information and profile picture
3. **Project Management**: Add, edit, delete projects and mark as featured
4. **Experience Management**: Add, edit, delete work experiences
5. **Real-time Preview**: View changes on the public site instantly

## 📡 API Endpoints

### Authentication
- `POST /auth/login` - Admin login

### Public Endpoints
- `GET /` - Get all portfolio data
- `GET /hero` - Get hero section data
- `GET /projects` - Get all projects (with optional featured filter)
- `GET /experiences` - Get all experiences

### Admin Endpoints (requires JWT token)
- `POST /hero` - Create/update hero section
- `POST /projects` - Create new project
- `PUT /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project
- `POST /experiences` - Create new experience
- `PUT /experiences/{id}` - Update experience
- `DELETE /experiences/{id}` - Delete experience

## 🎨 Design Features

### Custom Styling
- **Font Family**: Uses the specified system font stack for optimal readability
- **Color Scheme**: Teal accent colors (#14B8A6, #4FD1C7) with gray scale
- **Typography**: Carefully chosen font sizes and spacing
- **Layout**: Matches the reference design with hero, featured work, projects, and experiences sections

### Responsive Design
- Mobile-first approach
- Responsive navigation
- Optimized layouts for different screen sizes
- Touch-friendly interface

## 🔧 Customization

### Environment Variables
Create a `.env` file in the backend directory:

```env
DATABASE_URL=sqlite:///./portfolio.db
SECRET_KEY=your-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

### Database Schema
The SQLite database includes tables for:
- **heroes**: Hero section content
- **projects**: Project information with featured flag
- **experiences**: Work experience data

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Backend Deployment
```bash
cd backend
pip install -r requirements.txt
# Configure your production server with uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 📝 Usage Tips

1. **Adding Projects**: Include clear descriptions, relevant technologies, and working links
2. **Profile Image**: Use a high-quality, professional image (URL-based)
3. **Featured Projects**: Limit to 3-4 most important projects
4. **Experience Descriptions**: Keep concise but informative
5. **Skills**: Use comma-separated values for easy management

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend is running on port 8000
2. **Database Issues**: Delete `portfolio.db` to reset database
3. **Package Issues**: Clear node_modules and reinstall
4. **Port Conflicts**: Change ports in configuration files

### Support
For issues or questions, please check the API documentation at `http://localhost:8000/docs` when the backend is running.

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ for Umer Saeed's Portfolio**
