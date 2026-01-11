# Jobbmatchning

## Overview
AI-powered job matching platform (Jobbmatchning) that connects job seekers with employers. Built with React frontend and FastAPI backend.

## Architecture

### Frontend
- **Framework**: React 19 with CRACO (Create React App Configuration Override)
- **Styling**: Tailwind CSS with shadcn/ui components (Radix UI primitives)
- **Routing**: React Router DOM
- **State**: React Hook Form with Zod validation
- **Port**: 5000 (development)

### Backend
- **Framework**: FastAPI
- **Database**: MongoDB (via Motor async driver)
- **Port**: 8000 (when running)
- **API Prefix**: `/api`

## Project Structure
```
frontend/           # React frontend application
  src/
    components/     # React components
      screens/      # Page/screen components
      ui/           # shadcn/ui components
    hooks/          # Custom React hooks
    services/       # API service functions
    config/         # App configuration
  plugins/          # CRACO plugins (visual edits, health check)
  public/           # Static assets

backend/            # FastAPI backend
  server.py         # Main API server
  requirements.txt  # Python dependencies

memory/             # Project documentation
tests/              # Test files
```

## Environment Variables
- `PORT`: Frontend development server port (default: 5000)
- `HOST`: Frontend development server host (default: 0.0.0.0)
- `MONGO_URL`: MongoDB connection string (required for backend)
- `DB_NAME`: MongoDB database name (default: jobbmatchning)

## Development
- Frontend: `cd frontend && npm start`
- Backend: `cd backend && uvicorn server:app --host localhost --port 8000`

## Key Features
- Job seeker profiles with preferences
- Employer job postings
- AI-powered match scoring
- Calendar invites for interviews
- Admin dashboard with statistics
