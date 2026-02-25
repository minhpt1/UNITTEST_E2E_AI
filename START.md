# Personal Blog - Quick Start Guide

## Available Startup Options

### Option 1: NPM Scripts (Recommended)
```bash
# Install all dependencies (backend + frontend)
npm run install:all

# Start both servers concurrently
npm run start:all
# or
npm run start:dev
```

### Option 2: Windows Batch Script
Double-click `start-blog.bat` or run:
```cmd
start-blog.bat
```

### Option 3: PowerShell Script
```powershell
.\start-blog.ps1
```

### Option 4: Linux/Mac Bash Script
```bash
chmod +x start-blog.sh
./start-blog.sh
```

### Option 5: Manual Start (Separate Terminals)
**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

## Servers
- **Backend API:** http://localhost:3002
- **Frontend Web:** http://localhost:3001

## First Time Setup
1. Make sure Node.js is installed
2. Run `npm run install:all` to install all dependencies
3. Use any of the startup options above

## Notes
- The backend will auto-create sample data on first run
- Both servers support hot-reload during development
- Use Ctrl+C to stop servers when running manually