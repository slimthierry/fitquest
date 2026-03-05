from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.exceptions import ConflictException, UnauthorizedException
from app.auth.security import hash_password, verify_password, create_access_token
from app.models.user_models import User
from app.schemas.auth_schemas import RegisterRequest, LoginRequest, AuthResponse


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def register(self, data: RegisterRequest) -> AuthResponse:
        result = await self.db.execute(select(User).where(User.email == data.email))
        existing_user = result.scalar_one_or_none()

        if existing_user:
            raise ConflictException("A user with this email already exists")

        user = User(
            email=data.email,
            name=data.name,
            hashed_password=hash_password(data.password),
            level=1,
            total_xp=0,
            current_streak=0,
            longest_streak=0,
        )
        self.db.add(user)
        await self.db.flush()
        await self.db.refresh(user)

        token = create_access_token(data={"sub": str(user.id)})

        return AuthResponse(
            access_token=token,
            user_id=user.id,
            name=user.name,
            email=user.email,
            level=user.level,
            total_xp=user.total_xp,
        )

    async def login(self, data: LoginRequest) -> AuthResponse:
        result = await self.db.execute(select(User).where(User.email == data.email))
        user = result.scalar_one_or_none()

        if not user or not verify_password(data.password, user.hashed_password):
            raise UnauthorizedException("Invalid email or password")

        token = create_access_token(data={"sub": str(user.id)})

        return AuthResponse(
            access_token=token,
            user_id=user.id,
            name=user.name,
            email=user.email,
            level=user.level,
            total_xp=user.total_xp,
        )
