from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user_models import User
from app.schemas.leaderboard_schemas import LeaderboardEntry, LeaderboardResponse


class LeaderboardService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_leaderboard(
        self, current_user: User, limit: int = 50
    ) -> LeaderboardResponse:
        count_result = await self.db.execute(select(func.count()).select_from(User))
        total_users = count_result.scalar()

        result = await self.db.execute(
            select(User).order_by(User.total_xp.desc()).limit(limit)
        )
        users = result.scalars().all()

        entries = []
        current_user_rank = None

        for idx, user in enumerate(users, start=1):
            entries.append(
                LeaderboardEntry(
                    rank=idx,
                    user_id=user.id,
                    name=user.name,
                    avatar_url=user.avatar_url,
                    level=user.level,
                    total_xp=user.total_xp,
                    current_streak=user.current_streak,
                    longest_streak=user.longest_streak,
                )
            )
            if user.id == current_user.id:
                current_user_rank = idx

        if current_user_rank is None:
            rank_result = await self.db.execute(
                select(func.count())
                .select_from(User)
                .where(User.total_xp > current_user.total_xp)
            )
            current_user_rank = rank_result.scalar() + 1

        return LeaderboardResponse(
            entries=entries,
            total_users=total_users,
            current_user_rank=current_user_rank,
        )
