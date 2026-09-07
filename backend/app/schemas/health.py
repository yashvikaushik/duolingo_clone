from pydantic import BaseModel


class HealthCheckResponse(BaseModel):
    status: str
    environment: str
    version: str
    database: str
