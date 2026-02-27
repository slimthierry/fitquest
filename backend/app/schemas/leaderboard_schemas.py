from pydantic import BaseModel


class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    name: str
    avatar_url: str | None = None
    level: int
    total_xp: int
    current_streak: int
    longest_streak: int


class LeaderboardResponse(BaseModel):
    entries: list[LeaderboardEntry]
    total_users: int
    current_user_rank: int | None = None
