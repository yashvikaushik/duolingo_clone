from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.firebase import verify_firebase_id_token
from app.models.user import User
from app.services.user_service import UserService

# HTTP Bearer security scheme
security = HTTPBearer(auto_error=True)
optional_security = HTTPBearer(auto_error=False)


def get_token_payload(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> Dict[str, Any]:
    """
    Validates Firebase Bearer token and returns the decoded token payload.
    """
    token = credentials.credentials
    try:
        payload = verify_firebase_id_token(token)
        return payload
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(
    payload: Dict[str, Any] = Depends(get_token_payload),
    db: Session = Depends(get_db),
) -> User:
    """
    FastAPI dependency that loads or provisions the application User from DB
    associated with the validated Firebase token.
    """
    firebase_uid = payload.get("uid") or payload.get("user_id") or payload.get("sub")
    if not firebase_uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload missing user identifier",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_service = UserService(db)
    user = user_service.get_by_firebase_uid(firebase_uid)

    if not user:
        # If user is valid in Firebase but not yet synced to DB, auto-provision
        email = payload.get("email", f"{firebase_uid}@duouser.internal")
        name = payload.get("name")
        picture = payload.get("picture")
        user = user_service.sync_user(
            firebase_uid=firebase_uid,
            email=email,
            display_name=name,
            avatar_url=picture,
        )

    return user
