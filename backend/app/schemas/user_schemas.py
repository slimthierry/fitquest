from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: str | None = None
    avatar_url: str | None = None


class UserResponse(UserBase):
    id: int
    avatar_url: str | None = None
    level: int
    total_xp: int
    current_streak: int
    longest_streak: int
    created_at: datetime

    model_config = {"from_attributes": True}


class UserProfileResponse(UserResponse):
    total_workouts: int = 0
    total_quests_completed: int = 0
    total_achievements: int = 0
    xp_to_next_level: int = 0
    xp_progress_percent: float = 0.0
