from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict


class UserBase(BaseModel):
    email: EmailStr
    username: Optional[str] = None
    display_name: Optional[str] = None
    age: Optional[int] = None
    country: Optional[str] = None
    avatar_url: Optional[str] = None


class UserCreate(UserBase):
    firebase_uid: str


class UserUpdate(BaseModel):
    username: Optional[str] = None
    display_name: Optional[str] = None
    age: Optional[int] = None
    country: Optional[str] = None
    avatar_url: Optional[str] = None


class UserSyncRequest(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    display_name: Optional[str] = None
    age: Optional[int] = None
    country: Optional[str] = None
    avatar_url: Optional[str] = None


class UserResponse(BaseModel):
    """Basic user response without stats."""
    id: int
    firebase_uid: str
    email: str
    username: Optional[str] = None
    display_name: Optional[str] = None
    age: Optional[int] = None
    country: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserStatsResponse(BaseModel):
    """Game stats for a user."""
    streak: int = 0
    total_xp: int = 0
    current_league: Optional[str] = None
    top_3_finishes: int = 0
    gems: int = 500
    hearts: int = 5

    model_config = ConfigDict(from_attributes=True)


class UserProfileResponse(BaseModel):
    """
    Full profile response combining User + UserStats.
    This is the primary response for GET /users/me and POST /auth/sync.
    """
    id: int
    firebase_uid: str
    email: str
    username: Optional[str] = None
    display_name: Optional[str] = None
    age: Optional[int] = None
    country: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    # Stats (flattened from UserStats)
    streak: int = 0
    total_xp: int = 0
    current_league: Optional[str] = None
    top_3_finishes: int = 0
    gems: int = 500
    hearts: int = 5

    # Social counts (placeholder until follow system is built)
    followers_count: int = 0
    following_count: int = 0

    model_config = ConfigDict(from_attributes=True)
