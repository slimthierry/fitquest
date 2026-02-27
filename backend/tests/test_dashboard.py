import pytest
from datetime import date
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_dashboard(client: AsyncClient, auth_headers):
    response = await client.get("/api/v1/dashboard", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "level" in data
    assert "total_xp" in data
    assert "xp_to_next_level" in data
    assert "xp_progress_percent" in data
    assert "current_streak" in data
    assert "active_quests" in data
    assert "recent_workouts" in data
    assert "weekly_stats" in data
    assert "total_achievements" in data


@pytest.mark.asyncio
async def test_dashboard_after_workout(client: AsyncClient, auth_headers):
    await client.post(
        "/api/v1/workouts",
        headers=auth_headers,
        json={
            "type": "running",
            "duration_minutes": 30,
            "calories_burned": 300,
            "date": str(date.today()),
        },
    )

    response = await client.get("/api/v1/dashboard", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_xp"] > 0
    assert data["weekly_stats"]["total_workouts"] >= 1
    assert len(data["recent_workouts"]) >= 1


@pytest.mark.asyncio
async def test_dashboard_xp_progress(client: AsyncClient, auth_headers):
    response = await client.get("/api/v1/dashboard", headers=auth_headers)
    data = response.json()
    assert data["xp_to_next_level"] == 100
    assert data["xp_progress_percent"] >= 0
    assert data["xp_progress_percent"] <= 100
