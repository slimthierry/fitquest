from datetime import date, timedelta, datetime, timezone

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import NotFoundException
from app.models.user_models import User
from app.models.workout_models import Workout, Exercise, WorkoutType
from app.schemas.workout_schemas import (
    WorkoutCreate,
    WorkoutUpdate,
    WorkoutResponse,
    WorkoutListResponse,
    WeeklyStatsResponse,
)
from app.services.xp_service import XPService


class WorkoutService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.xp_service = XPService(db)

    async def create_workout(self, user: User, data: WorkoutCreate) -> WorkoutResponse:
        xp_earned = await self.xp_service.award_workout_xp(user, data.duration_minutes)

        workout = Workout(
            user_id=user.id,
            type=data.type,
            duration_minutes=data.duration_minutes,
            calories_burned=data.calories_burned,
            distance_km=data.distance_km,
            notes=data.notes,
            date=data.date,
            xp_earned=xp_earned,
        )
        self.db.add(workout)
        await self.db.flush()
        await self.db.refresh(workout)

        for exercise_data in data.exercises:
            exercise = Exercise(
                workout_id=workout.id,
                name=exercise_data.name,
                sets=exercise_data.sets,
                reps=exercise_data.reps,
                weight_kg=exercise_data.weight_kg,
                duration_seconds=exercise_data.duration_seconds,
            )
            self.db.add(exercise)

        await self._update_streak(user, data.date)
        await self.db.flush()
        await self.db.refresh(workout)

        return WorkoutResponse.model_validate(workout)

    async def get_workout(self, user: User, workout_id: int) -> WorkoutResponse:
        result = await self.db.execute(
            select(Workout)
            .options(selectinload(Workout.exercises))
            .where(and_(Workout.id == workout_id, Workout.user_id == user.id))
        )
        workout = result.scalar_one_or_none()

        if not workout:
            raise NotFoundException("Workout not found")

        return WorkoutResponse.model_validate(workout)

    async def list_workouts(
        self,
        user: User,
        page: int = 1,
        per_page: int = 20,
        workout_type: WorkoutType | None = None,
    ) -> WorkoutListResponse:
        query = select(Workout).where(Workout.user_id == user.id)

        if workout_type:
            query = query.where(Workout.type == workout_type)

        count_result = await self.db.execute(
            select(func.count()).select_from(query.subquery())
        )
        total = count_result.scalar()

        result = await self.db.execute(
            query.options(selectinload(Workout.exercises))
            .order_by(Workout.date.desc())
            .offset((page - 1) * per_page)
            .limit(per_page)
        )
        workouts = result.scalars().all()

        return WorkoutListResponse(
            workouts=[WorkoutResponse.model_validate(w) for w in workouts],
            total=total,
            page=page,
            per_page=per_page,
        )

    async def update_workout(
        self, user: User, workout_id: int, data: WorkoutUpdate
    ) -> WorkoutResponse:
        result = await self.db.execute(
            select(Workout)
            .options(selectinload(Workout.exercises))
            .where(and_(Workout.id == workout_id, Workout.user_id == user.id))
        )
        workout = result.scalar_one_or_none()

        if not workout:
            raise NotFoundException("Workout not found")

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(workout, key, value)

        await self.db.flush()
        await self.db.refresh(workout)

        return WorkoutResponse.model_validate(workout)

    async def delete_workout(self, user: User, workout_id: int) -> None:
        result = await self.db.execute(
            select(Workout).where(and_(Workout.id == workout_id, Workout.user_id == user.id))
        )
        workout = result.scalar_one_or_none()

        if not workout:
            raise NotFoundException("Workout not found")

        await self.db.delete(workout)

    async def get_weekly_stats(self, user: User) -> WeeklyStatsResponse:
        today = date.today()
        week_start = today - timedelta(days=today.weekday())

        result = await self.db.execute(
            select(Workout).where(
                and_(
                    Workout.user_id == user.id,
                    Workout.date >= week_start,
                    Workout.date <= today,
                )
            )
        )
        workouts = result.scalars().all()

        total_workouts = len(workouts)
        total_minutes = sum(w.duration_minutes for w in workouts)
        total_calories = sum(w.calories_burned or 0 for w in workouts)
        total_xp = sum(w.xp_earned for w in workouts)
        total_distance = sum(w.distance_km or 0 for w in workouts)

        workouts_by_type: dict[str, int] = {}
        for w in workouts:
            key = w.type.value
            workouts_by_type[key] = workouts_by_type.get(key, 0) + 1

        return WeeklyStatsResponse(
            total_workouts=total_workouts,
            total_minutes=total_minutes,
            total_calories=total_calories,
            total_xp=total_xp,
            total_distance_km=total_distance,
            workouts_by_type=workouts_by_type,
        )

    async def _update_streak(self, user: User, workout_date: date) -> None:
        yesterday = workout_date - timedelta(days=1)

        result = await self.db.execute(
            select(Workout).where(
                and_(
                    Workout.user_id == user.id,
                    Workout.date == yesterday,
                )
            )
        )
        yesterday_workout = result.scalar_one_or_none()

        if yesterday_workout:
            user.current_streak += 1
        else:
            result = await self.db.execute(
                select(Workout).where(
                    and_(
                        Workout.user_id == user.id,
                        Workout.date == workout_date,
                        Workout.id != None,
                    )
                )
            )
            today_workouts = result.scalars().all()
            if len(today_workouts) <= 1:
                user.current_streak = 1

        if user.current_streak > user.longest_streak:
            user.longest_streak = user.current_streak
