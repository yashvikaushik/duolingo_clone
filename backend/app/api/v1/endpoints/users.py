from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.services.user_service import UserService

router = APIRouter()


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get Current User Profile",
    description="Returns the database profile of the currently authenticated user.",
)
def get_me(current_user: User = Depends(get_current_user)) -> UserResponse:
    return current_user


@router.put(
    "/me",
    response_model=UserResponse,
    summary="Update Current User Profile",
    description="Updates editable profile attributes (username, display name, avatar).",
)
def update_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserResponse:
    service = UserService(db)
    try:
        updated = service.update_profile(current_user, user_update)
        return updated
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
