"""add new column: disabled to enum employee_status

Revision ID: e1eda93d8219
Revises: 558eb3254b30
Create Date: 2023-11-05 15:50:08.868200

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'e1eda93d8219'
down_revision: Union[str, None] = '558eb3254b30'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.sync_enum_values('public', 'employeestatus', ['invited', 'active', 'disabled'],
                        [('employee', 'employee_status')],
                        enum_values_to_rename=[])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.sync_enum_values('public', 'employeestatus', ['invited', 'active'],
                        [('employee', 'employee_status')],
                        enum_values_to_rename=[])
    # ### end Alembic commands ###