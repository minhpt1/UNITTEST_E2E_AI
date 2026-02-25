# Personal Blog Project

A simple personal blog project built with TypeScript, Express.js (Backend) and React (Frontend), using JSON database.

## Features

### Backend (Express.js + TypeScript)
- ✅ RESTful API with TypeScript
- ✅ Simple JSON database
- ✅ Post management (create, read, update)
- ✅ Category and tag system
- ✅ Comment system (requires approval)
- ✅ Personal page with author information
- ✅ Pagination and filtering

### Frontend (React + TypeScript)
- ✅ Responsive web interface
- ✅ Homepage with latest posts
- ✅ Blog page with search and filtering
- ✅ Post detail page
- ✅ Personal profile page
- ✅ Create new post form
- ✅ Comment system
- ✅ Responsive design for mobile

## Project Structure

```
├── src/                    # Backend (Express.js)
│   ├── models/            # TypeScript model definitions
│   ├── database/          # JSON database management class
│   └── index.ts           # Main server with API endpoints
├── client/                # Frontend (React)
│   ├── src/
│   │   ├── pages/         # React page components
│   │   ├── services/      # API service calls
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Main React app
│   └── public/            # Static assets
└── data/                  # Database JSON files
    └── database.json      # Database file (auto-generated)
```

## Installation and Setup

### Quick Start (Recommended)
```bash
# Install all dependencies (backend + frontend)
npm run install:all

# Start both servers concurrently
npm run start:dev
```

### Alternative Start Methods

#### Option 1: NPM Scripts
```bash
npm run start:all    # Start both servers
npm run start:dev    # Start both servers (same as above)
```

#### Option 2: Windows Batch Script
```cmd
# Double-click or run:
start-blog.bat
```

#### Option 3: PowerShell Script
```powershell
.\start-blog.ps1
```

#### Option 4: Linux/Mac Bash Script
```bash
chmod +x start-blog.sh
./start-blog.sh
```

### Manual Setup (If needed)

### 1. Install dependencies for both backend and frontend:
```bash
# Backend dependencies
npm install

# Frontend dependencies  
cd client
npm install
cd ..
```

### 2. Run in development mode (separate terminals):

**Terminal 1 - Backend:**
```bash
npm run dev
```
Backend runs at: http://localhost:3002

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```
Frontend runs at: http://localhost:3001

### 3. Build and run production:
```bash
# Build backend
npm run build

# Build frontend
cd client
npm run build
cd ..

# Run production
npm start
```

## API Endpoints

### Homepage
- `GET /api/home` - Get latest posts, categories and tags

### Profile
- `GET /api/profile` - Get author information

### Blog
- `GET /api/posts` - Get list of posts (with pagination, filtering)
- `GET /api/posts/:slug` - Get post details by slug
- `POST /api/admin/posts` - Create new post (admin)
- `POST /api/posts/:slug/comments` - Add comment

### Categories and Tags
- `GET /api/categories` - Get all categories
- `GET /api/tags` - Get all tags

## Frontend Pages

### 1. Homepage (/)
- Hero section
- Latest posts
- Sidebar with categories and tags

### 2. Blog Page (/blog)
- List of all posts
- Filter by category and tags
- Pagination
- Sidebar filters

### 3. Post Detail (/posts/:slug)
- Full post content
- Comment system
- Add comment form

### 4. Profile Page (/profile)
- Author personal information
- Social links
- Bio and description

### 5. Create Post Page (/create-post)
- New post creation form
- Category selection
- Tag management
- Draft/Published status

## Models

### User
- Blog author information
- Includes name, email, bio, avatar, social links

### BlogPost
- Posts with title, content, summary
- Supports slug, category, tags
- Status: draft, published, archived

### Category & Tag
- Post classification
- Has slug and description

### Comment
- Reader comments

## Sample Data

When running for the first time, the system automatically creates:
- Default user
- 2 categories: Technology and Personal
- Database file at `./data/database.json`

## Features

### Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Navigation hamburger menu on mobile

### API Integration
- Axios for API calls
- Error handling
- Loading states
- Type-safe with TypeScript

### User Experience
- Smooth transitions and animations
- Loading indicators
- Error messages
- Success feedback

## Future Development

Can be extended with:
- Authentication & Authorization
- File upload for images
- Rich text editor (TinyMCE/Quill)
- Search functionality
- SEO optimization
- Email notifications for comments
- Admin dashboard
- Dark/Light theme toggle
- Social media sharing
- PWA support