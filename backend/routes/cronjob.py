from fastapi import APIRouter

cron = APIRouter()

@cron.get("/cron")
def cronjob():
    return "WORKING"
