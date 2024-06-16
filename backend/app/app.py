from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

development = os.environ.get("Development")
if development:
    from mongo_db import (
        get_event_docs,
        insert_event_doc,
        update_event_docs,
        delete_event_docs,
        pin_event_doc,
    )
else:
    from .mongo_db import (
        get_event_docs,
        insert_event_doc,
        update_event_docs,
        delete_event_docs,
        pin_event_doc,
    )

app = FastAPI()
origins = ["http://localhost:3000", "https://daysmatterclone.onrender.com"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    }


@app.get("/")
async def root():
    events_docs = get_event_docs()
    events = list(map(convert_mongo_documents, events_docs))
    return {"data": events}


@app.post("/newevent")
async def new_event(event: Event):
    insert_event_doc(event.model_dump())
    return {"status": 200, "message": "OK"}


@app.put("/newevent/{event_id}")
async def update_event(event_id: str, event: Event):
    update_event_docs(event_id, event.model_dump())
    return {"status": 200, "message": "OK"}


@app.delete("/deleteevent/{event_id}")
async def delete_event(event_id: str):
    delete_event_docs(event_id)
    return {"status": 200, "message": "OK"}

@app.put("/pinevent/{event_id}")
async def pin_event(event_id:str):
    pin_event_doc(event_id)
    return {"status": 200, "message": "OK"}

# TODO: Toggle the counted days in week.months.years
# TODO: Add picture