from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import func, select

from backend.database import AIUsage

# How many AI requests ONE user may make per day
DAILY_LIMITS = {"chat": 40, "flashcards": 10, "quiz": 10}

# How many AI requests ALL users together may make per day.
# Placeholder: check your providers' current free limits and set this
# to roughly 70% of the smallest daily limit.
GLOBAL_DAILY_LIMIT = 600


def _start_of_today():
    now = datetime.now(timezone.utc)
    return now.replace(hour=0, minute=0, second=0, microsecond=0, tzinfo=None)


def use_quota(db, user_id, kind):
    since = _start_of_today()

    # 1. Has everyone together used up today's allowance?
    total_today = db.execute(
        select(func.count()).select_from(AIUsage).where(AIUsage.created_at >= since)
    ).scalar_one()
    if total_today >= GLOBAL_DAILY_LIMIT:
        raise HTTPException(
            status_code=429,
            detail="ACE has reached its daily limit for everyone. Please try again tomorrow.",
        )

    # 2. Has this user used up their allowance for this kind of request?
    used_today = db.execute(
        select(func.count())
        .select_from(AIUsage)
        .where(
            AIUsage.user_id == user_id,
            AIUsage.kind == kind,
            AIUsage.created_at >= since,
        )
    ).scalar_one()
    limit = DAILY_LIMITS[kind]
    if used_today >= limit:
        raise HTTPException(
            status_code=429,
            detail=f"You have used all {limit} {kind} requests for today. Try again tomorrow.",
        )

    # 3. Allowed: write down that this request happened
    db.add(AIUsage(user_id=user_id, kind=kind))
    db.commit()