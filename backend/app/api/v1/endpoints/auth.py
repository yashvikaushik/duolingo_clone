from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_token_payload
from app.schemas.user import UserSyncRequest, UserResponse
from app.services.user_service import UserService

router = APIRouter()


@router.post(
    "/sync",
    response_model=UserResponse,
    summary="Sync Authenticated User",
    description="Synchronizes or creates the application database user record from a verified Firebase token.",
)
def sync_authenticated_user(
    sync_data: UserSyncRequest = UserSyncRequest(),
    payload: Dict[str, Any] = Depends(get_token_payload),
    db: Session = Depends(get_db),
) -> UserResponse:
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
    )

    return user
