from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.config.database import engine
from app.models.base import Base
from app.loggers import setup_logging
from app.routes import app_router
@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()
app = FastAPI(
    title="FitQuest API",
    description="Gamified fitness tracking with quests, XP, levels and leaderboards",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(workouts.router, prefix="/api/v1/workouts", tags=["Workouts"])
app.include_router(quests.router, prefix="/api/v1/quests", tags=["Quests"])
app.include_router(achievements.router, prefix="/api/v1/achievements", tags=["Achievements"])
app.include_router(leaderboard.router, prefix="/api/v1/leaderboard", tags=["Leaderboard"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "fitquest-api"}
