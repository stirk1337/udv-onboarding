"""Task description limit 1 million (1.000.000)

Revision ID: 209f574c87bf
Revises: f12026525e0b
Create Date: 2023-11-17 14:23:41.946447

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = '209f574c87bf'
down_revision: Union[str, None] = 'f12026525e0b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('task', 'description',
                    existing_type=sa.VARCHAR(length=10000),
                    type_=sa.String(length=1000000),
                    existing_nullable=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('task', 'description',
                    existing_type=sa.String(length=1000000),
                    type_=sa.VARCHAR(length=10000),
                    existing_nullable=True)
    # ### end Alembic commands ###