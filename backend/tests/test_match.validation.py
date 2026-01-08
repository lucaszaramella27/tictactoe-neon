import pytest # type: ignore

pytestmark = pytest.mark.asyncio


async def _register(client, email, name):
    r = await client.post("/auth/register", json={"email": email, "display_name": name, "password": "12345678"})
    assert r.status_code == 201
    return r.json()["id"]


async def _login(client, email):
    r = await client.post(
        "/auth/login",
        data={"username": email, "password": "12345678"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert r.status_code == 200
    return r.json()["access_token"]


async def test_pvp_match_updates_ranking(client):
    await _register(client, "p1@local.dev", "P1")
    p2_id = await _register(client, "p2@local.dev", "P2")
    token = await _login(client, "p1@local.dev")

    # X vence: 0,1,2
    payload = {
        "mode": "PVP",
        "your_symbol": "X",
        "opponent_id": p2_id,
        "moves": [
            {"symbol": "X", "pos": 0},
            {"symbol": "O", "pos": 3},
            {"symbol": "X", "pos": 1},
            {"symbol": "O", "pos": 4},
            {"symbol": "X", "pos": 2},
        ],
        "declared_result": "X",
    }
    r = await client.post("/matches", json=payload, headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 201
    assert r.json()["validated_result"] == "X"

    r = await client.get("/ranking/top")
    assert r.status_code == 200
    top = r.json()
    assert len(top) >= 2
    assert top[0]["points"] == 3
