from datetime import datetime

from pydantic import BaseModel

from app.models.quest_models import QuestType, QuestDifficulty, QuestStatus


class QuestCreate(BaseModel):
    name: str
    description: str
    type: QuestType
    target_value: float
    target_unit: str
    reward_xp: int
    duration_days: int
    icon: str = "trophy"
    difficulty: QuestDifficulty


class QuestResponse(BaseModel):
    id: int
    name: str
    description: str
    type: QuestType
    target_value: float
    target_unit: str
    reward_xp: int
    duration_days: int
    icon: str
    difficulty: QuestDifficulty
    is_active: bool

    model_config = {"from_attributes": True}


class UserQuestResponse(BaseModel):
    id: int
    user_id: int
    quest_id: int
    progress: float
    status: QuestStatus
    started_at: datetime
    completed_at: datetime | None = None
    quest: QuestResponse

    model_config = {"from_attributes": True}


class AcceptQuestRequest(BaseModel):
    quest_id: int


class QuestProgressUpdate(BaseModel):
    progress: float
