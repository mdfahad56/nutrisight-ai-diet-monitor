from sqlalchemy.exc import OperationalError
from fastapi import HTTPException

from app.api.routes.api import register
from app.schemas.schemas import RegisterIn


class UnavailableDatabase:
    def query(self, *_args, **_kwargs):
        raise OperationalError("SELECT 1", {}, RuntimeError("database unavailable"))

    def rollback(self):
        self.rolled_back = True


def test_registration_database_failure_is_logged_and_is_generic_to_client():
    body = RegisterIn(name="Test User", email="test@example.com", password="SecurePass123!")
    try:
        register(body, UnavailableDatabase())
    except HTTPException as error:
        assert error.status_code == 500
        assert error.detail == "Unable to create account. Please try again later."
    else:
        raise AssertionError("Expected the unavailable database to fail registration")
