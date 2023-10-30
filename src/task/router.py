from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.models import User
from src.db import get_async_session
from src.task.dals import PlanetDAL

router = APIRouter(prefix='/task',
                   tags=['Task'])


class CreatePlanet(BaseModel):
    name: str


class ShowPlanetAfterCreation(BaseModel):
    id: int
    name: str


@router.post('/create_planet')
async def create_planet(body: CreatePlanet, db: AsyncSession = Depends(get_async_session),
                        user: User = Depends()) -> ShowPlanetAfterCreation:

    async with db as session:
        async with session.begin():
            planet_dal = PlanetDAL(session)
            planet = await planet_dal.create_planet(
                name=body.name
            )
            return ShowPlanetAfterCreation(
                id=planet.id,
                name=planet.name
            )
