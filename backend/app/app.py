from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from mongo_db import (
    get_event_docs,
    insert_event_doc,
    update_event_docs,
    delete_event_docs,
    pin_event_doc,
)
from calculation import calculate_difference
import logging


app = FastAPI()
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Event(BaseModel):
    event: str
    start_date: str
    end_date: str = None
    ongoing: bool
    pin_on_top: bool


def convert_mongo_documents(doc):
    return {
        "event_id": str(doc["_id"]),
        "event": doc["event"],
        "start_date": doc["start_date"],
        "end_date": doc.get("end_date", ""),
        "ongoing": doc["ongoing"],
        "pin_on_top": doc.get("pin_on_top", ""),
        "days_diff": doc.get("days_diff", {}),
    }

# ___________________________
#
#         Endpoints
# ___________________________

@app.get("/")
async def root():
    events_docs = get_event_docs()
    events = list(map(convert_mongo_documents, events_docs))
    for event in events:
        event["days_diff"] = calculate_difference(
            event["start_date"], event["end_date"]
        )
    logger.info(f"Get Response: get once from backend")
    return {"data": events}


@app.post("/newevent")
async def new_event(event: Event):
    result = insert_event_doc(event.model_dump())
    logger.info(f"Insert Response: {result}")
    return result


@app.put("/newevent/{event_id}")
async def update_event(event_id: str, event: Event):
    result = update_event_docs(event_id, event.model_dump())
    logger.info(f"Update Response: {result}")
    return result


@app.delete("/deleteevent/{event_id}")
async def delete_event(event_id: str):
    result = delete_event_docs(event_id)
    logger.info(f"Delete Response: {result}")
    return result


@app.put("/pinevent/{event_id}")
async def pin_event(event_id: str):
    result = pin_event_doc(event_id)
    logger.info(f"Pin Response: {result}")
    return result
