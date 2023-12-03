from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import curator_user
from src.auth.models import User
from src.db import get_async_session
from src.user.dals import CuratorDAL, EmployeeDAL
from src.user.models import Employee


async def have_employee(employee_id: int,
                        user: User = Depends(curator_user),
                        session: AsyncSession = Depends(get_async_session)) -> Employee:
    employee_dal = EmployeeDAL(session)
    curator_dal = CuratorDAL(session)
    curator = await curator_dal.get_curator_by_user(user)
    employee = await employee_dal.get_employee_by_id_with_user(employee_id)
    if employee.curator_id == curator.id:
        return employee
    raise HTTPException(status_code=403, detail='Forbidden')
