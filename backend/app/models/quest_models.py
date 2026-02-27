import enum
from datetime import datetime

from sqlalchemy import Integer, String, Float, Enum, ForeignKey, Boolean, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class QuestType(str, enum.Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    SPECIAL = "special"


class QuestDifficulty(str, enum.Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"
    LEGENDARY = "legendary"


class QuestStatus(str, enum.Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    FAILED = "failed"
    EXPIRED = "expired"


class Quest(Base, TimestampMixin):
    __tablename__ = "quests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[QuestType] = mapped_column(Enum(QuestType), nullable=False)
    target_value: Mapped[float] = mapped_column(Float, nullable=False)
    target_unit: Mapped[str] = mapped_column(String(50), nullable=False)
    reward_xp: Mapped[int] = mapped_column(Integer, nullable=False)
    duration_days: Mapped[int] = mapped_column(Integer, nullable=False)
    icon: Mapped[str] = mapped_column(String(50), default="trophy", nullable=False)
    difficulty: Mapped[QuestDifficulty] = mapped_column(Enum(QuestDifficulty), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    user_quests = relationship("UserQuest", back_populates="quest", lazy="selectin")

    def __repr__(self) -> str:
        return f"<Quest(id={self.id}, name='{self.name}', difficulty='{self.difficulty}')>"


class UserQuest(Base):
    __tablename__ = "user_quests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    quest_id: Mapped[int] = mapped_column(Integer, ForeignKey("quests.id"), nullable=False, index=True)
    progress: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    status: Mapped[QuestStatus] = mapped_column(Enum(QuestStatus), default=QuestStatus.ACTIVE, nullable=False)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="user_quests")
    quest = relationship("Quest", back_populates="user_quests")

    def __repr__(self) -> str:
        return f"<UserQuest(user_id={self.user_id}, quest_id={self.quest_id}, status='{self.status}')>"
