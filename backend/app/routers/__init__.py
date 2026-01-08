from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.matches import router as matches_router
from app.routers.ranking import router as ranking_router

__all__ = ["auth_router", "users_router", "matches_router", "ranking_router"]
