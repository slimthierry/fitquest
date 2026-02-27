from datetime import date, datetime

from pydantic import BaseModel

from app.models.workout_models import WorkoutType


class ExerciseCreate(BaseModel):
    name: str
    sets: int | None = None
    reps: int | None = None
    weight_kg: float | None = None
    duration_seconds: int | None = None


class ExerciseResponse(ExerciseCreate):
    id: int

    model_config = {"from_attributes": True}


class WorkoutCreate(BaseModel):
    type: WorkoutType
    duration_minutes: int
    calories_burned: int | None = None
    distance_km: float | None = None
    notes: str | None = None
    date: date
    exercises: list[ExerciseCreate] = []


class WorkoutUpdate(BaseModel):
    type: WorkoutType | None = None
    duration_minutes: int | None = None
    calories_burned: int | None = None
    distance_km: float | None = None
    notes: str | None = None
    date: date | None = None


class WorkoutResponse(BaseModel):
    id: int
    user_id: int
    type: WorkoutType
    duration_minutes: int
    calories_burned: int | None = None
    distance_km: float | None = None
    notes: str | None = None
    date: date
    xp_earned: int
    exercises: list[ExerciseResponse] = []
    created_at: datetime

    model_config = {"from_attributes": True}


class WorkoutListResponse(BaseModel):
    workouts: list[WorkoutResponse]
    total: int
    page: int
    per_page: int


class WeeklyStatsResponse(BaseModel):
    total_workouts: int
    total_minutes: int
    total_calories: int
    total_xp: int
    total_distance_km: float
    workouts_by_type: dict[str, int]
