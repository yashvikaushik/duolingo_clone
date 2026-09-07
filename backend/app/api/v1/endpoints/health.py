from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.config import settings
from app.db.session import get_db
from app.schemas.health import HealthCheckResponse

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthCheckResponse,
    summary="Health Check",
    description="Returns the current operational status of the service and database connectivity.",
)
def check_health(db: Session = Depends(get_db)) -> HealthCheckResponse:
    db_status = "connected"
    try:
        # Run simple query to verify database engine connectivity
        db.execute(text("SELECT 1"))
    except Exception:
        db_status = "unavailable"

    return HealthCheckResponse(
        status="ok",
        environment=settings.ENVIRONMENT,
        version=settings.VERSION,
        database=db_status,
    )
