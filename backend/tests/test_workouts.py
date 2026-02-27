import pytest
from datetime import date
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_workout(client: AsyncClient, auth_headers):
    response = await client.post(
        "/api/v1/workouts",
        headers=auth_headers,
        json={
            "type": "running",
            "duration_minutes": 30,
            "calories_burned": 300,
            "distance_km": 5.0,
            "notes": "Morning run",
            "date": str(date.today()),
            "exercises": [],
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["type"] == "running"
    assert data["duration_minutes"] == 30
    assert data["xp_earned"] > 0


@pytest.mark.asyncio
async def test_create_workout_with_exercises(client: AsyncClient, auth_headers):
    response = await client.post(
        "/api/v1/workouts",
        headers=auth_headers,
        json={
            "type": "gym",
            "duration_minutes": 60,
            "calories_burned": 500,
            "date": str(date.today()),
            "exercises": [
                {"name": "Bench Press", "sets": 3, "reps": 10, "weight_kg": 60},
                {"name": "Squats", "sets": 4, "reps": 8, "weight_kg": 80},
            ],
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["type"] == "gym"
    assert len(data["exercises"]) == 2


@pytest.mark.asyncio
async def test_list_workouts(client: AsyncClient, auth_headers):
    await client.post(
        "/api/v1/workouts",
        headers=auth_headers,
        json={
            "type": "yoga",
            "duration_minutes": 45,
            "date": str(date.today()),
        },
    )

    response = await client.get("/api/v1/workouts", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert len(data["workouts"]) >= 1


@pytest.mark.asyncio
async def test_list_workouts_filter_by_type(client: AsyncClient, auth_headers):
    await client.post(
        "/api/v1/workouts",
        headers=auth_headers,
        json={"type": "running", "duration_minutes": 20, "date": str(date.today())},
    )
    await client.post(
        "/api/v1/workouts",
        headers=auth_headers,
        json={"type": "cycling", "duration_minutes": 40, "date": str(date.today())},
    )

    response = await client.get(
        "/api/v1/workouts?workout_type=running", headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    for workout in data["workouts"]:
        assert workout["type"] == "running"


@pytest.mark.asyncio
async def test_get_weekly_stats(client: AsyncClient, auth_headers):
    await client.post(
        "/api/v1/workouts",
        headers=auth_headers,
        json={
            "type": "hiit",
            "duration_minutes": 25,
            "calories_burned": 350,
            "date": str(date.today()),
        },
    )

    response = await client.get("/api/v1/workouts/weekly-stats", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_workouts"] >= 1
    assert data["total_minutes"] >= 25


@pytest.mark.asyncio
async def test_delete_workout(client: AsyncClient, auth_headers):
    create_response = await client.post(
        "/api/v1/workouts",
        headers=auth_headers,
        json={"type": "swimming", "duration_minutes": 30, "date": str(date.today())},
    )
    workout_id = create_response.json()["id"]

    response = await client.delete(f"/api/v1/workouts/{workout_id}", headers=auth_headers)
    assert response.status_code == 204
