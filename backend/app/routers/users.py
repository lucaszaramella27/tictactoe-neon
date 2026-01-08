from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db import get_session
from app.models.user import User
from app.schemas.user import UserOut
from app.routers.auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserOut)
async def me(current: User = Depends(get_current_user)):
    return current


@router.get("", response_model=list[UserOut])
async def list_users(
    session: AsyncSession = Depends(get_session),
    current: User = Depends(get_current_user),
):
    rows = (await session.execute(select(User).where(User.id != current.id).order_by(User.display_name.asc()))).scalars()
    return list(rows)
