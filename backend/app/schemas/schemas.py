from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ─── Auth Schemas ─────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    email: str
    password: str                    # This is actually the auth verifier (hex string)
    master_password_salt: str
    master_password_verifier: str


class UserLogin(BaseModel):
    email: str
    password: str                    # Auth verifier (hex string)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class SaltResponse(BaseModel):
    salt: str


class VerifyVerifierRequest(BaseModel):
    verifier: str


# ─── Vault Schemas ────────────────────────────────────────────────────────────

class VaultItemCreate(BaseModel):
    title: str
    url: Optional[str] = ""
    email: Optional[str] = ""
    username: Optional[str] = ""
    encrypted_password: str
    category: Optional[str] = "Others"
    notes: Optional[str] = ""
    is_favorite: Optional[bool] = False
    tags: Optional[str] = ""


class VaultItemUpdate(BaseModel):
    title: Optional[str] = None
    url: Optional[str] = None
    email: Optional[str] = None
    username: Optional[str] = None
    encrypted_password: Optional[str] = None
    category: Optional[str] = None
    notes: Optional[str] = None
    is_favorite: Optional[bool] = None
    tags: Optional[str] = None


class VaultItemOut(BaseModel):
    id: int
    title: str
    url: Optional[str] = ""
    email: Optional[str] = ""
    username: Optional[str] = ""
    encrypted_password: str
    category: Optional[str] = "Others"
    notes: Optional[str] = ""
    is_favorite: bool = False
    tags: Optional[str] = ""
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─── Password History Schemas ─────────────────────────────────────────────────

class HistoryItemCreate(BaseModel):
    label: Optional[str] = ""
    encrypted_password: str
    strength_score: Optional[int] = 0
    strength_label: Optional[str] = "Unknown"


class HistoryItemOut(BaseModel):
    id: int
    label: Optional[str] = ""
    encrypted_password: str
    strength_score: int
    strength_label: str
    created_at: datetime

    class Config:
        from_attributes = True
