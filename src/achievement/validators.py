from typing import Optional

from pydantic import BaseModel


class ShowAchievement(BaseModel):
    name: str
    description: str
    completed: Optional[bool] = False

    @staticmethod
    def parse(name: str, description: str, completed: bool):
        return ShowAchievement(name=name,
                               description=description,
                               completed=completed)
