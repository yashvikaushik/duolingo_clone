from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, func
from app.db.base import Base


def utc_now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    firebase_uid = Column(String(128), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=True)
    display_name = Column(String(150), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        default=utc_now,
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        default=utc_now,
        onupdate=utc_now,
        nullable=False,
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email='{self.email}' username='{self.username}'>"
