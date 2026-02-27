from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.core.dependencies import get_current_user
from app.models.user_models import User
from app.models.workout_models import WorkoutType
from app.schemas.workout_schemas import (
    WorkoutCreate,
    WorkoutUpdate,
    WorkoutResponse,
    WorkoutListResponse,
    WeeklyStatsResponse,
)
from app.services.workout_service import WorkoutService

router = APIRouter()


@router.post("", response_model=WorkoutResponse, status_code=201)
async def create_workout(
    data: WorkoutCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = WorkoutService(db)
    return await service.create_workout(current_user, data)


@router.get("", response_model=WorkoutListResponse)
async def list_workouts(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    workout_type: WorkoutType | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = WorkoutService(db)
    return await service.list_workouts(current_user, page, per_page, workout_type)


@router.get("/weekly-stats", response_model=WeeklyStatsResponse)
async def get_weekly_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = WorkoutService(db)
    return await service.get_weekly_stats(current_user)


@router.get("/{workout_id}", response_model=WorkoutResponse)
async def get_workout(
    workout_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = WorkoutService(db)
    return await service.get_workout(current_user, workout_id)


@router.patch("/{workout_id}", response_model=WorkoutResponse)
async def update_workout(
    workout_id: int,
    data: WorkoutUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = WorkoutService(db)
    return await service.update_workout(current_user, workout_id, data)


@router.delete("/{workout_id}", status_code=204)
async def delete_workout(
    workout_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = WorkoutService(db)
    await service.delete_workout(current_user, workout_id)
