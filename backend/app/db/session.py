from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from app.db.base import Base
# Import all models so Base.metadata knows about them
import app.models  # noqa: F401

# SQLite requires 'check_same_thread: False' for multi-threaded FastAPI execution
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=settings.ENVIRONMENT == "development",
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def init_db() -> None:
    """
    Initializes database tables defined in Base.metadata.
    """
    Base.metadata.create_all(bind=engine)


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that yields a SQLAlchemy database session per request
    and automatically handles session teardown.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
