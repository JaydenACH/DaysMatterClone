from fastapi import APIRouter


events_router = APIRouter()

@events_router.get("/newevent")
async def read_event():
    return {"message": "This is a new event endpoint"}

@events_router.post("/newevent")
async def create_event(event: dict):
    return {"message": "Event created successfully", "event": event}
