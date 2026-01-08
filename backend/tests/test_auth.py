import pytest # type: ignore

pytestmark = pytest.mark.asyncio


async def test_register_login_and_me(client):
    r = await client.post(
        "/auth/register",
        json={"email": "a@a.com", "display_name": "Alice", "password": "12345678"},
    )
    assert r.status_code == 201

    # OAuth2 form
    r = await client.post(
        "/auth/login",
        data={"username": "a@a.com", "password": "12345678"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert r.status_code == 200
    token = r.json()["access_token"]

    r = await client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert r.json()["email"] == "a@a.com"
