"""Create planet, planet tables

Revision ID: 5e47f74aa3a2
Revises: 69c8745c5f06
Create Date: 2023-10-29 20:38:32.906774

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '5e47f74aa3a2'
down_revision: Union[str, None] = '69c8745c5f06'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    sa.Enum('easy', 'medium', 'hard',
            name='taskdifficulty').create(op.get_bind())
    sa.Enum('in_progress', 'being_checked', 'completed',
            name='taskstatus').create(op.get_bind())
    op.create_table('planet',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('name', sa.String(length=100), nullable=False),
                    sa.Column('created_at', sa.DateTime(), server_default=sa.text(
                        "TIMEZONE('utc', now())"), nullable=False),
                    sa.Column('updated_at', sa.DateTime(), server_default=sa.text(
                        "TIMEZONE('utc', now())"), nullable=False),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_table('task',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('name', sa.String(length=100), nullable=False),
                    sa.Column('description', sa.String(
                        length=1000), nullable=False),
                    sa.Column('file_link', sa.String(
                        length=500), nullable=True),
                    sa.Column('task_status', postgresql.ENUM('in_progress', 'being_checked',
                                                             'completed', name='taskstatus', create_type=False), nullable=False),
                    sa.Column('task_difficulty', postgresql.ENUM('easy', 'medium', 'hard',
                                                                 name='taskdifficulty', create_type=False), nullable=False),
                    sa.Column('planet_id', sa.Integer(), nullable=False),
                    sa.Column('created_at', sa.DateTime(), server_default=sa.text(
                        "TIMEZONE('utc', now())"), nullable=False),
                    sa.Column('updated_at', sa.DateTime(), server_default=sa.text(
                        "TIMEZONE('utc', now())"), nullable=False),
                    sa.ForeignKeyConstraint(
                        ['planet_id'], ['planet.id'], ondelete='CASCADE'),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_table('employee_planet',
                    sa.Column('employee_id', sa.Integer(), nullable=False),
                    sa.Column('planet_id', sa.Integer(), nullable=False),
                    sa.ForeignKeyConstraint(
                        ['employee_id'], ['employee.id'], ondelete='CASCADE'),
                    sa.ForeignKeyConstraint(
                        ['planet_id'], ['planet.id'], ondelete='CASCADE'),
                    sa.PrimaryKeyConstraint('employee_id', 'planet_id')
                    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('employee_planet')
    op.drop_table('planet')
    op.drop_table('planet')
    sa.Enum('in_progress', 'being_checked', 'completed',
            name='taskstatus').drop(op.get_bind())
    sa.Enum('easy', 'medium', 'hard', name='taskdifficulty').drop(op.get_bind())
    # ### end Alembic commands ###
