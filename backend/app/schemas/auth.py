from __future__ import annotations

from app.core.security import hash_password, verify_password, create_access_token

from pydantic import BaseModel, EmailStr, Field

class RegisterIn(BaseModel):
    email: EmailStr
    display_name: str = Field(min_length=3, max_length=32)
    password: str = Field(min_length=6, max_length=256)

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
