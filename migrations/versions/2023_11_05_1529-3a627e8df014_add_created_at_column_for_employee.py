"""Add created_at column for employee

Revision ID: 3a627e8df014
Revises: c71512191dc0
Create Date: 2023-11-05 15:29:00.300227

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = '3a627e8df014'
down_revision: Union[str, None] = 'c71512191dc0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('employee', sa.Column('created_at', sa.DateTime(
    ), server_default=sa.text("TIMEZONE('utc', now())"), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('employee', 'created_at')
    # ### end Alembic commands ###
