import enum
from datetime import datetime

from sqlalchemy import Integer, String, Enum, ForeignKey, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class AchievementRarity(str, enum.Enum):
    COMMON = "common"
    RARE = "rare"
    EPIC = "epic"
    LEGENDARY = "legendary"


class Achievement(Base, TimestampMixin):
    __tablename__ = "achievements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    icon: Mapped[str] = mapped_column(String(50), default="star", nullable=False)
    xp_reward: Mapped[int] = mapped_column(Integer, nullable=False)
    condition_type: Mapped[str] = mapped_column(String(100), nullable=False)
    condition_value: Mapped[int] = mapped_column(Integer, nullable=False)
    rarity: Mapped[AchievementRarity] = mapped_column(
        Enum(AchievementRarity), default=AchievementRarity.COMMON, nullable=False
    )

    user_achievements = relationship("UserAchievement", back_populates="achievement", lazy="selectin")

    def __repr__(self) -> str:
        return f"<Achievement(id={self.id}, name='{self.name}', rarity='{self.rarity}')>"


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    achievement_id: Mapped[int] = mapped_column(Integer, ForeignKey("achievements.id"), nullable=False, index=True)
    earned_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    user = relationship("User", back_populates="user_achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")

    def __repr__(self) -> str:
        return f"<UserAchievement(user_id={self.user_id}, achievement_id={self.achievement_id})>"
