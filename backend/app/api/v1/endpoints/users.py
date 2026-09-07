import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.user import UserProfileResponse, UserUpdate
from app.services.user_service import UserService

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "/me",
    response_model=UserProfileResponse,
    summary="Get Current User Profile",
    description="Returns the full profile (user data + game stats) of the currently authenticated user.",
)
def get_me(current_user: User = Depends(get_current_user)) -> UserProfileResponse:
    profile = UserService.build_profile_response(current_user)
    logger.info(f"[GET /users/me] Returning profile for: {profile.email} (id={profile.id}, username={profile.username}, xp={profile.total_xp}, gems={profile.gems}, hearts={profile.hearts})")
    return profile


@router.put(
    "/me",
    response_model=UserProfileResponse,
    summary="Update Current User Profile",
    description="Updates editable profile attributes (username, display name, age, country, avatar).",
)
def update_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserProfileResponse:
    service = UserService(db)
    try:
        updated = service.update_profile(current_user, user_update)
        return UserService.build_profile_response(updated)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
