from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class UserStats(Base):
    """
    Stores game-related statistics for each user.
    One-to-one relationship with the User model.
    """
    __tablename__ = "user_stats"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )

    streak = Column(Integer, default=0, nullable=False)
    total_xp = Column(Integer, default=0, nullable=False)
    current_league = Column(String(50), nullable=True)
    top_3_finishes = Column(Integer, default=0, nullable=False)
    gems = Column(Integer, default=500, nullable=False)
    hearts = Column(Integer, default=5, nullable=False)

    # One-to-one back-reference to User
    user = relationship("User", back_populates="stats")

    def __repr__(self) -> str:
        return f"<UserStats user_id={self.user_id} xp={self.total_xp} streak={self.streak}>"
