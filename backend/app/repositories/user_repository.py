from typing import Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from app.models.user import User
from app.models.user_stats import UserStats
from app.schemas.user import UserCreate, UserUpdate


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: int) -> Optional[User]:
        stmt = select(User).options(joinedload(User.stats)).where(User.id == user_id)
        return self.db.execute(stmt).scalar_one_or_none()

    def get_by_firebase_uid(self, firebase_uid: str) -> Optional[User]:
        stmt = (
            select(User)
            .options(joinedload(User.stats))
            .where(User.firebase_uid == firebase_uid)
        )
        return self.db.execute(stmt).scalar_one_or_none()

    def get_by_email(self, email: str) -> Optional[User]:
        stmt = (
            select(User)
            .options(joinedload(User.stats))
            .where(User.email == email)
        )
        return self.db.execute(stmt).scalar_one_or_none()

    def get_by_username(self, username: str) -> Optional[User]:
        stmt = select(User).where(User.username == username)
        return self.db.execute(stmt).scalar_one_or_none()

    def create(self, user_in: UserCreate) -> User:
        """Creates a new User and its associated UserStats in a single transaction."""
        user = User(
            firebase_uid=user_in.firebase_uid,
            email=user_in.email,
            username=user_in.username,
            display_name=user_in.display_name,
            age=user_in.age,
            country=user_in.country,
            avatar_url=user_in.avatar_url,
        )
        self.db.add(user)
        self.db.flush()  # Assign user.id without committing

        # Create default UserStats for the new user
        stats = UserStats(user_id=user.id)
        self.db.add(stats)

        self.db.commit()
        self.db.refresh(user)
        return user

    def ensure_stats(self, user: User) -> User:
        """Ensures a UserStats row exists for the given user (backfill for legacy rows)."""
        if user.stats is None:
            stats = UserStats(user_id=user.id)
            self.db.add(stats)
            self.db.commit()
            self.db.refresh(user)
        return user

    def update(self, user: User, user_in: UserUpdate) -> User:
        update_data = user_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        self.db.commit()
        self.db.refresh(user)
        return user
