from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone
from typing import Any

from jose import jwt
from passlib.context import CryptContext
from passlib.exc import UnknownHashError


# -----------------------------------------------------------------------------
# Config (tenta settings; se não existir, usa env)
# -----------------------------------------------------------------------------
try:
    from app.core.config import settings  # type: ignore

    SECRET_KEY: str = settings.SECRET_KEY
    ALGORITHM: str = settings.ALGORITHM
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(getattr(settings, "ACCESS_TOKEN_EXPIRE_MINUTES", 60))
except Exception:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    if not isinstance(password, str) or not password:
        raise ValueError("Password inválida.")
    # bcrypt usa no máximo 72 bytes
    if len(password.encode("utf-8")) > 72:
        raise ValueError("Password muito longa (bcrypt usa no máximo 72 bytes).")
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not plain_password or not hashed_password:
        return False
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except (UnknownHashError, ValueError, TypeError):
        return False


def create_access_token(
    subject: str,
    expires_minutes: int | None = None,
    extra: dict[str, Any] | None = None,
) -> str:
    if not subject:
        raise ValueError("subject é obrigatório.")

    now = datetime.now(timezone.utc)
    minutes = ACCESS_TOKEN_EXPIRE_MINUTES if expires_minutes is None else int(expires_minutes)
    exp = now + timedelta(minutes=minutes)

    payload: dict[str, Any] = {"sub": subject, "iat": int(now.timestamp()), "exp": exp}

    if extra:
        for k in ("sub", "iat", "exp"):
            if k in extra:
                raise ValueError(f"Claim '{k}' é reservado e não pode vir em extra.")
        payload.update(extra)

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict[str, Any]:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
