import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.quest_models import Quest, QuestType, QuestDifficulty


@pytest.fixture
async def sample_quest(db_session: AsyncSession):
    quest = Quest(
        name="Run 10km",
        description="Complete a total of 10 kilometers of running",
        type=QuestType.WEEKLY,
        target_value=10.0,
        target_unit="km",
        reward_xp=500,
        duration_days=7,
        icon="running",
        difficulty=QuestDifficulty.MEDIUM,
        is_active=True,
    )
    db_session.add(quest)
    await db_session.commit()
    await db_session.refresh(quest)
    return quest


@pytest.mark.asyncio
async def test_list_available_quests(client: AsyncClient, auth_headers, sample_quest):
    response = await client.get("/api/v1/quests/available", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["name"] == "Run 10km"


@pytest.mark.asyncio
async def test_accept_quest(client: AsyncClient, auth_headers, sample_quest):
    response = await client.post(
        "/api/v1/quests/accept",
        headers=auth_headers,
        json={"quest_id": sample_quest.id},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["quest_id"] == sample_quest.id
    assert data["status"] == "active"
    assert data["progress"] == 0


@pytest.mark.asyncio
async def test_accept_quest_duplicate(client: AsyncClient, auth_headers, sample_quest):
    await client.post(
        "/api/v1/quests/accept",
        headers=auth_headers,
        json={"quest_id": sample_quest.id},
    )

    response = await client.post(
        "/api/v1/quests/accept",
        headers=auth_headers,
        json={"quest_id": sample_quest.id},
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_get_my_quests(client: AsyncClient, auth_headers, sample_quest):
    await client.post(
        "/api/v1/quests/accept",
        headers=auth_headers,
        json={"quest_id": sample_quest.id},
    )

    response = await client.get("/api/v1/quests/my", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1


@pytest.mark.asyncio
async def test_update_quest_progress(client: AsyncClient, auth_headers, sample_quest):
    accept_response = await client.post(
        "/api/v1/quests/accept",
        headers=auth_headers,
        json={"quest_id": sample_quest.id},
    )
    user_quest_id = accept_response.json()["id"]

    response = await client.patch(
        f"/api/v1/quests/{user_quest_id}/progress",
        headers=auth_headers,
        json={"progress": 5.0},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["progress"] == 5.0
    assert data["status"] == "active"


@pytest.mark.asyncio
async def test_complete_quest(client: AsyncClient, auth_headers, sample_quest):
    accept_response = await client.post(
        "/api/v1/quests/accept",
        headers=auth_headers,
        json={"quest_id": sample_quest.id},
    )
    user_quest_id = accept_response.json()["id"]

    response = await client.patch(
        f"/api/v1/quests/{user_quest_id}/progress",
        headers=auth_headers,
        json={"progress": 10.0},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "completed"
    assert data["completed_at"] is not None
