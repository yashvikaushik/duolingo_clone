import logging
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_token_payload
from app.schemas.user import UserSyncRequest, UserProfileResponse
from app.services.user_service import UserService

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/sync",
    response_model=UserProfileResponse,
    summary="Sync Authenticated User",
    description="Synchronizes or creates the application database user record from a verified Firebase token.",
)
def sync_authenticated_user(
    sync_data: UserSyncRequest = UserSyncRequest(),
    payload: Dict[str, Any] = Depends(get_token_payload),
    db: Session = Depends(get_db),
) -> UserProfileResponse:
    firebase_uid = payload.get("uid") or payload.get("user_id") or payload.get("sub")
    if not firebase_uid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token does not contain a valid Firebase UID",
        )

    # Use email from token or from request body
    email = payload.get("email") or sync_data.email
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User email is required for registration",
        )

    display_name = sync_data.display_name or payload.get("name")
    avatar_url = sync_data.avatar_url or payload.get("picture")
    preferred_username = sync_data.username

    service = UserService(db)
    user = service.sync_user(
        firebase_uid=firebase_uid,
        email=email,
        display_name=display_name,
        avatar_url=avatar_url,
        preferred_username=preferred_username,
        age=sync_data.age,
        country=sync_data.country,
    )

    profile = UserService.build_profile_response(user)

    # ── Console log: show user data on every sync ──
    logger.info("=" * 60)
    logger.info("  AUTH SYNC — User Logged In / Registered")
    logger.info("=" * 60)
    logger.info(f"  ID            : {profile.id}")
    logger.info(f"  Firebase UID  : {profile.firebase_uid}")
    logger.info(f"  Email         : {profile.email}")
    logger.info(f"  Username      : {profile.username}")
    logger.info(f"  Display Name  : {profile.display_name}")
    logger.info(f"  Avatar URL    : {profile.avatar_url}")
    logger.info(f"  Age           : {profile.age}")
    logger.info(f"  Country       : {profile.country}")
    logger.info(f"  Created At    : {profile.created_at}")
    logger.info("-" * 40)
    logger.info(f"  Streak        : {profile.streak}")
    logger.info(f"  Total XP      : {profile.total_xp}")
    logger.info(f"  Gems          : {profile.gems}")
    logger.info(f"  Hearts        : {profile.hearts}")
    logger.info(f"  League        : {profile.current_league}")
    logger.info(f"  Top 3 Finishes: {profile.top_3_finishes}")
    logger.info("=" * 60)

    return profile

