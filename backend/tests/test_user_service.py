import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base import Base
from app.models.user import User
from app.services.user_service import UserService
from app.schemas.user import UserUpdate

TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture
def db_session():
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


def test_create_and_sync_user(db_session):
    service = UserService(db_session)
    
    # 1. Sync new user
    user = service.sync_user(
        firebase_uid="firebase_test_uid_123",
        email="learner@example.com",
        display_name="Test Learner",
        avatar_url="https://example.com/avatar.png",
    )
    
    assert user.id is not None
    assert user.firebase_uid == "firebase_test_uid_123"
    assert user.email == "learner@example.com"
    assert user.display_name == "Test Learner"
    assert user.avatar_url == "https://example.com/avatar.png"
    assert user.username is not None

    # 2. Sync existing user without duplicating
    synced_user = service.sync_user(
        firebase_uid="firebase_test_uid_123",
        email="learner@example.com",
        display_name="Updated Display Name",
    )
    
    assert synced_user.id == user.id
    assert synced_user.display_name == "Test Learner"  # preserved


def test_update_profile(db_session):
    service = UserService(db_session)
    user = service.sync_user(
        firebase_uid="uid_456",
        email="user2@example.com",
        display_name="User Two",
    )

    updated = service.update_profile(
        user,
        UserUpdate(display_name="New Name", username="custom_username_123"),
    )
    assert updated.display_name == "New Name"
    assert updated.username == "custom_username_123"
