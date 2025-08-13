"""Change policy rule_value column to JSON

Revision ID: b41b3684b110
Revises: fb4beb308c2a
Create Date: 2025-08-13 00:31:06.711720

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'b41b3684b110'
down_revision: Union[str, Sequence[str], None] = 'fb4beb308c2a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Change rule_value column from String to JSON
    op.alter_column('policies', 'rule_value',
                    existing_type=sa.VARCHAR(),
                    type_=postgresql.JSON(),
                    postgresql_using='rule_value::json')


def downgrade() -> None:
    """Downgrade schema."""
    # Change rule_value column back from JSON to String
    op.alter_column('policies', 'rule_value',
                    existing_type=postgresql.JSON(),
                    type_=sa.VARCHAR(),
                    postgresql_using='rule_value::text')