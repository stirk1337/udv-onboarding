from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import curator_user
from src.auth.models import User
from src.db import get_async_session
from src.request_codes import responses
from src.task.dals import PlanetDAL

router = APIRouter(prefix='/task',
                   tags=['Task'])


class CreatePlanet(BaseModel):
    name: str


class ShowPlanetAfterCreation(BaseModel):
    id: int
    name: str
    curator_id: int


@router.post('/create_planet',
             responses=responses)
async def create_planet(body: CreatePlanet, session: AsyncSession = Depends(get_async_session),
                        user: User = Depends(curator_user)) -> ShowPlanetAfterCreation:
    planet_dal = PlanetDAL(session)
    planet = await planet_dal.create_planet(name=body.name, user=user)
    return ShowPlanetAfterCreation(id=planet.id, name=planet.name, curator_id=planet.curator_id)
