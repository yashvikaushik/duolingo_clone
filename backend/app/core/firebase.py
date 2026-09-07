import os
import logging
from typing import Optional, Dict, Any
import firebase_admin
from firebase_admin import credentials, auth
import jwt
from jwt import PyJWKClient
from app.core.config import settings

logger = logging.getLogger(__name__)

# Global singleton for Firebase Admin app
_firebase_app: Optional[firebase_admin.App] = None

def init_firebase_admin() -> Optional[firebase_admin.App]:
    """
    Initializes and returns the global Firebase Admin App instance.
    Checks for existing default app instance before creating a new one.
    """
    global _firebase_app
    if _firebase_app is not None:
        return _firebase_app

    # 1. Check if default Firebase app already exists
    try:
        _firebase_app = firebase_admin.get_app()
        return _firebase_app
    except ValueError:
        pass  # App not initialized yet

    # 2. Initialize Firebase app with service account or project ID
    try:
        if settings.FIREBASE_CREDENTIALS_PATH and os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
            _firebase_app = firebase_admin.initialize_app(cred, {
                "projectId": settings.FIREBASE_PROJECT_ID,
            })
            logger.info("Firebase Admin initialized with service account certificate.")
        elif settings.FIREBASE_PROJECT_ID:
            _firebase_app = firebase_admin.initialize_app(options={
                "projectId": settings.FIREBASE_PROJECT_ID,
            })
            logger.info(f"Firebase Admin initialized with project ID: {settings.FIREBASE_PROJECT_ID}")
        else:
            _firebase_app = firebase_admin.initialize_app()
            logger.info("Firebase Admin initialized with default options.")
    except Exception as e:
        logger.warning(f"Could not initialize Firebase Admin SDK: {e}")
        try:
            _firebase_app = firebase_admin.get_app()
        except Exception:
            _firebase_app = None

    return _firebase_app



# Google JWKS endpoint for Firebase Token verification fallback
GOOGLE_JWKS_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
_jwks_client: Optional[PyJWKClient] = None

def get_jwks_client() -> PyJWKClient:
    global _jwks_client
    if _jwks_client is None:
        _jwks_client = PyJWKClient(GOOGLE_JWKS_URL)
    return _jwks_client


def verify_firebase_id_token(id_token: str) -> Dict[str, Any]:
    """
    Verifies a Firebase ID token.
    First tries Firebase Admin SDK. If admin SDK is not fully authenticated with a private key,
    verifies the JWT using Google's public JWKS keys for project validation.
    """
    init_firebase_admin()
    
    # 1. Try Firebase Admin SDK
    try:
        decoded = auth.verify_id_token(id_token, check_revoked=False)
        return decoded
    except Exception as admin_err:
        logger.debug(f"Firebase Admin verify failed ({admin_err}), falling back to Google JWKS verification.")

    # 2. Fallback: Verify JWT with Google Public JWKS keys directly
    try:
        jwks_client = get_jwks_client()
        signing_key = jwks_client.get_signing_key_from_jwt(id_token)
        
        # Audience is the Firebase project ID, Issuer is https://securetoken.google.com/<project_id>
        decoded = jwt.decode(
            id_token,
            signing_key.key,
            algorithms=["RS256"],
            audience=settings.FIREBASE_PROJECT_ID,
            issuer=f"https://securetoken.google.com/{settings.FIREBASE_PROJECT_ID}",
            options={"verify_exp": True},
        )
        return decoded
    except Exception as jwks_err:
        logger.error(f"JWKS token verification failed: {jwks_err}")
        # In case project ID is mismatched or test environment, decode unverified for debugging in development only
        if settings.ENVIRONMENT == "development":
            try:
                unverified = jwt.decode(id_token, options={"verify_signature": False})
                if unverified.get("sub") or unverified.get("user_id"):
                    logger.warning("Token signature unverified fallback accepted in development mode only.")
                    return unverified
            except Exception:
                pass
        raise ValueError(f"Invalid or expired Firebase ID token: {jwks_err}")
