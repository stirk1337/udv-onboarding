"""EmployeeTask Table, many to many

Revision ID: d2450c7faa8d
Revises: 209f574c87bf
Create Date: 2023-11-17 23:58:45.356077

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'd2450c7faa8d'
down_revision: Union[str, None] = '209f574c87bf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('employee_task',
                    sa.Column('employee_id', sa.Integer(), nullable=False),
                    sa.Column('task_id', sa.Integer(), nullable=False),
                    sa.Column('employee_answer', sa.String(
                        length=1000), nullable=True),
                    sa.Column('task_status', postgresql.ENUM('in_progress', 'being_checked',
                                                             'completed', name='taskstatus', create_type=False), nullable=False),
                    sa.Column('created_at', sa.DateTime(), server_default=sa.text(
                        "TIMEZONE('utc', now())"), nullable=False),
                    sa.Column('updated_at', sa.DateTime(), server_default=sa.text(
                        "TIMEZONE('utc', now())"), nullable=False),
                    sa.ForeignKeyConstraint(
                        ['employee_id'], ['employee.id'], ondelete='CASCADE'),
                    sa.ForeignKeyConstraint(
                        ['task_id'], ['task.id'], ondelete='CASCADE'),
                    sa.PrimaryKeyConstraint('employee_id', 'task_id')
                    )
    op.add_column('employee_planet', sa.Column('created_at', sa.DateTime(
    ), server_default=sa.text("TIMEZONE('utc', now())"), nullable=False))
    op.add_column('employee_planet', sa.Column('updated_at', sa.DateTime(
    ), server_default=sa.text("TIMEZONE('utc', now())"), nullable=False))
    op.drop_column('task', 'task_status')
    op.drop_column('task', 'employee_answer')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('task', sa.Column('employee_answer', sa.VARCHAR(
        length=1000), autoincrement=False, nullable=True))
    op.add_column('task', sa.Column('task_status', postgresql.ENUM('in_progress', 'being_checked',
                  'completed', name='taskstatus', create_type=False), autoincrement=False, nullable=False))
    op.drop_column('employee_planet', 'updated_at')
    op.drop_column('employee_planet', 'created_at')
    op.drop_table('employee_task')
    # ### end Alembic commands ###
