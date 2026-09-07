import re
import random
from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserUpdate


class UserService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = UserRepository(db)

    def _generate_unique_username(self, base_hint: str) -> str:
        """
        Generates a sanitized and unique username derived from email or display name.
        """
        # Strip special characters
        clean = re.sub(r"[^a-zA-Z0-9_]", "", base_hint.split("@")[0].lower())
        if not clean:
            clean = "duouser"
        clean = clean[:20]

        candidate = clean
        counter = 1
        while self.repo.get_by_username(candidate) is not None:
            suffix = str(random.randint(10, 999))
            candidate = f"{clean[:16]}{suffix}"
            counter += 1
            if counter > 50:
                candidate = f"{clean[:10]}{random.randint(100000, 999999)}"
                break

        return candidate

    def sync_user(
        self,
        firebase_uid: str,
        email: str,
        display_name: Optional[str] = None,
        avatar_url: Optional[str] = None,
        preferred_username: Optional[str] = None,
    ) -> User:
        """
        Synchronizes a Firebase authenticated user with the database.
        Creates a new user record if one does not exist, or updates existing metadata.
        """
        # 1. Search by Firebase UID
        user = self.repo.get_by_firebase_uid(firebase_uid)

        # 2. Search by Email if UID not found
        if not user and email:
            user = self.repo.get_by_email(email)
            if user:
                # Link existing user to new firebase_uid
                user.firebase_uid = firebase_uid
                self.db.commit()
                self.db.refresh(user)

        # 3. If user exists, update fields if new data available
        if user:
            needs_update = False
            if display_name and not user.display_name:
                user.display_name = display_name
                needs_update = True
            if avatar_url and not user.avatar_url:
                user.avatar_url = avatar_url
                needs_update = True
            if preferred_username and not user.username:
                if self.repo.get_by_username(preferred_username) is None:
                    user.username = preferred_username
                    needs_update = True

            if needs_update:
                self.db.commit()
                self.db.refresh(user)
            return user

        # 4. Create new user
        final_username = None
        if preferred_username and self.repo.get_by_username(preferred_username) is None:
            final_username = preferred_username
        else:
            hint = display_name or email.split("@")[0] if email else "learner"
            final_username = self._generate_unique_username(hint)

        user_in = UserCreate(
            firebase_uid=firebase_uid,
            email=email,
            username=final_username,
            display_name=display_name or final_username,
            avatar_url=avatar_url,
        )
        return self.repo.create(user_in)

    def get_by_firebase_uid(self, firebase_uid: str) -> Optional[User]:
        return self.repo.get_by_firebase_uid(firebase_uid)

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.repo.get_by_id(user_id)

    def update_profile(self, user: User, user_update: UserUpdate) -> User:
        # Check if username is being changed and is already taken
        if user_update.username and user_update.username != user.username:
            existing = self.repo.get_by_username(user_update.username)
            if existing and existing.id != user.id:
                raise ValueError("Username is already taken")

        return self.repo.update(user, user_update)
