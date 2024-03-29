"""Add send_task_count to Employee, add is_first_day to Planet

Revision ID: 52e21e9699ba
Revises: 6db5123bd673
Create Date: 2023-12-01 18:08:28.979218

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = '52e21e9699ba'
down_revision: Union[str, None] = '6db5123bd673'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('employee', sa.Column(
        'send_task_count', sa.Integer(), nullable=False))
    op.add_column('planet', sa.Column(
        'is_first_day', sa.Boolean(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('planet', 'is_first_day')
    op.drop_column('employee', 'send_task_count')
    # ### end Alembic commands ###
