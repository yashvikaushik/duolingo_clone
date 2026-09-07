from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict


class UserBase(BaseModel):
    email: EmailStr
    username: Optional[str] = None
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None


class UserCreate(UserBase):
    firebase_uid: str


class UserUpdate(BaseModel):
    username: Optional[str] = None
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None


class UserSyncRequest(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    firebase_uid: str
    email: str
    username: Optional[str] = None
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
