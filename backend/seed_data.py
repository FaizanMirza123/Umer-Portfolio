"""
Sample data seeder for the portfolio database
Run this script to populate the database with sample content
"""

from sqlalchemy.orm import sessionmaker
from db import engine
from models import Base, Hero, Project, Experience

# Create database tables
Base.metadata.create_all(bind=engine)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def seed_data():
    # Clear existing data
    db.query(Hero).delete()
    db.query(Project).delete()
    db.query(Experience).delete()

    # Create hero data
    hero = Hero(
        name="Umer Saeed",
        title="Full Stack Developer",
        description="Hey, I'm Umer Saeed. Here, you can check out what I'm working on. I try my best to create things with code.",
        profile_image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
    )
    db.add(hero)

    # Create sample projects
    projects = [
        Project(
            title="E-commerce Platform",
            description="A full-stack e-commerce solution with React frontend and Node.js backend. Features include user authentication, product catalog, shopping cart, and payment integration.",
            image="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
            github_url="https://github.com/example/ecommerce",
            live_url="https://ecommerce-demo.vercel.app",
            technologies=["React", "Node.js", "MongoDB", "Stripe", "Tailwind CSS"],
            is_featured=1
        ),
        Project(
            title="Task Management App",
            description="A collaborative task management application with real-time updates, team collaboration features, and productivity analytics.",
            image="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
            github_url="https://github.com/example/taskapp",
            live_url="https://taskapp-demo.vercel.app",
            technologies=["Next.js", "Prisma", "PostgreSQL", "Socket.io", "TypeScript"],
            is_featured=1
        ),
        Project(
            title="Weather Dashboard",
            description="A responsive weather dashboard that displays current weather conditions, forecasts, and interactive maps using OpenWeather API.",
            image="https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop",
            github_url="https://github.com/example/weather",
            live_url="https://weather-dashboard-demo.vercel.app",
            technologies=["Vue.js", "Express.js", "OpenWeather API", "Chart.js", "Bootstrap"],
            is_featured=1
        ),
        Project(
            title="Blog Platform",
            description="A modern blog platform with content management system, user authentication, and SEO optimization.",
            image="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop",
            github_url="https://github.com/example/blog",
            live_url="https://blog-demo.vercel.app",
            technologies=["Gatsby", "GraphQL", "Contentful", "Netlify"],
            is_featured=0
        ),
        Project(
            title="Portfolio Website",
            description="A responsive portfolio website showcasing projects and skills with admin dashboard for content management.",
            image="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop",
            github_url="https://github.com/example/portfolio",
            live_url="https://portfolio-demo.vercel.app",
            technologies=["React", "Tailwind CSS", "FastAPI", "SQLite"],
            is_featured=0
        ),
        Project(
            title="Mobile Fitness App",
            description="A React Native fitness tracking app with workout plans, progress tracking, and social features.",
            image="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
            github_url="https://github.com/example/fitness",
            technologies=["React Native", "Firebase", "Redux", "Expo"],
            is_featured=0
        )
    ]

    for project in projects:
        db.add(project)

    # Create sample experiences
    experiences = [
        Experience(
            title="Senior Full Stack Developer",
            company="TechCorp Solutions",
            duration="Jan 2023 - Present",
            location="New York, NY",
            description="Lead a team of 5 developers in building scalable web applications. Architected and implemented microservices using Node.js and Python. Improved application performance by 40% through optimization and best practices.",
            skills=["React", "Node.js", "Python", "AWS", "Docker", "PostgreSQL", "Redis", "Microservices"]
        ),
        Experience(
            title="Full Stack Developer",
            company="Innovation Labs",
            duration="Jun 2021 - Dec 2022",
            location="San Francisco, CA",
            description="Developed and maintained multiple client projects using modern web technologies. Collaborated with design teams to implement pixel-perfect UIs. Built RESTful APIs and integrated third-party services.",
            skills=["Vue.js", "Express.js", "MongoDB", "GraphQL", "Firebase", "Tailwind CSS", "Jest"]
        ),
        Experience(
            title="Frontend Developer",
            company="StartupXYZ",
            duration="Aug 2020 - May 2021",
            location="Remote",
            description="Built responsive web applications using React and TypeScript. Implemented state management with Redux and optimized application performance. Collaborated with UX/UI designers to create intuitive user interfaces.",
            skills=["React", "TypeScript", "Redux", "Material-UI", "Webpack", "SASS", "Git"]
        ),
        Experience(
            title="Junior Web Developer",
            company="WebDev Agency",
            duration="Jan 2020 - Jul 2020",
            location="Austin, TX",
            description="Developed client websites using HTML, CSS, and JavaScript. Learned modern frameworks and contributed to team projects. Gained experience in responsive design and cross-browser compatibility.",
            skills=["HTML5", "CSS3", "JavaScript", "Bootstrap", "jQuery", "PHP", "MySQL"]
        )
    ]

    for experience in experiences:
        db.add(experience)

    # Commit changes
    db.commit()
    print("✅ Database seeded successfully!")
    print("📊 Created:")
    print(f"   - 1 hero profile")
    print(f"   - {len(projects)} projects ({sum(1 for p in projects if p.is_featured)} featured)")
    print(f"   - {len(experiences)} experiences")
    print("\n🔑 Admin Login:")
    print("   Username: admin")
    print("   Password: admin123")
    print("\n🌐 Frontend: http://localhost:5173")
    print("📡 Backend API: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")

if __name__ == "__main__":
    seed_data()
    db.close()
