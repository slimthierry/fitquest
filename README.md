# FitQuest

Gamified fitness tracking application with quests, XP, levels, and leaderboards.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Monorepo**: pnpm + Turborepo

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Python >= 3.11
- Docker & Docker Compose

### Setup

```bash
# Install frontend dependencies
pnpm install

# Start infrastructure
docker-compose up -d postgres redis

# Setup backend
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head

# Run backend
uvicorn app.main:app --reload --port 84000

# Run frontend (from root)
pnpm dev:web
```

### Ports

- Frontend: http://localhost:3600
- Backend API: http://localhost:84000
- API Docs: http://localhost:84000/docs

## Project Structure

```
fitquest/
  backend/          # FastAPI Python backend
  apps/web/         # React + Vite frontend
  packages/
    types/          # Shared TypeScript types
    utils/          # Shared utilities
    ui/             # Shared UI components
    api-client/     # API client library
    theme/          # Theme configuration
```

## Level System

- XP per level: level * 100 (Level 1 = 100 XP, Level 2 = 200 XP, etc.)
- XP earned: 10 XP per workout minute + streak bonuses + quest rewards
- Streak: consecutive days with at least one workout
