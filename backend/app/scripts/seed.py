from __future__ import annotations

import asyncio
from sqlalchemy import select

from app.db import SessionLocal
from app.core.security import hash_password
from app.models.user import User
from app.models.ranking import Ranking


USERS = [
    ("neo@local.dev", "Neo", "12345678"),
    ("trinity@local.dev", "Trinity", "12345678"),
    ("morpheus@local.dev", "Morpheus", "12345678"),
]


async def main():
    async with SessionLocal() as session:
        for email, name, pwd in USERS:
            exists = (await session.execute(select(User).where(User.email == email))).scalar_one_or_none()
            if exists:
                continue
            u = User(email=email, display_name=name, password_hash=hash_password(pwd))
            session.add(u)
            await session.flush()
            session.add(Ranking(user_id=u.id))
        await session.commit()
    print("Seed concluído.")


if __name__ == "__main__":
    asyncio.run(main())
