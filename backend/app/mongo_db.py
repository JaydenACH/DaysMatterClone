from pymongo import MongoClient, DESCENDING, ASCENDING
from dotenv import load_dotenv, find_dotenv
import os
from bson.objectid import ObjectId
from bson.errors import InvalidId
from typing import Dict


load_dotenv(find_dotenv())
connection_string = os.environ.get("MONGO_LINK")
client = MongoClient(connection_string)
dbs = client.list_database_names()
daysmatter_db = client.daysmatter_db
collection = daysmatter_db.daysmatter


def insert_event_doc(data) -> Dict:
    collection.insert_one(data).inserted_id
    return {"status": 200, "message": "Successfully insert the event"}


def get_event_docs() -> list:
    events = collection.find().sort(
        [
            ("ongoing", DESCENDING),
            ("pin_on_top", DESCENDING),
            ("start_date", DESCENDING),
        ]
    )
    return list(events)


def update_event_docs(event_id: str, updated_event: dict) -> Dict:
    try:
        _id = ObjectId(event_id)
    except InvalidId:
        return {"status": 400, "message": "Invalid Id provided"}

    collection.update_one({"_id": _id}, {"$set": updated_event})
    return {"status": 200, "message": "Successfully update the event"}


def delete_event_docs(event_id: str) -> Dict:
    try:
        _id = ObjectId(event_id)
    except InvalidId:
        return {"status": 400, "message": "Invalid Id provided"}

    collection.delete_one({"_id": _id})
    return {"status": 200, "message": "Successfully delete the event"}


def pin_event_doc(event_id: str) -> Dict:
    try:
        _id = ObjectId(event_id)
    except InvalidId:
        return {"status": 400, "message": "Invalid Id provided"}

    event = collection.find_one({"_id": _id})
    if not event:
        return {"status": 404, "message": "Request not found"}

    # if provided event is not pinned, pin it and unpin others
    if not event.get("pin_on_top"):
        collection.update_one({"_id": _id}, {"$set": {"pin_on_top": True}})
        collection.update_many(
            {"pin_on_top": True, "_id": {"$ne": _id}}, {"$set": {"pin_on_top": False}}
        )
    else:
        # if provided event is pinned, unpin everyone
        collection.update_many({"pin_on_top": True}, {"$set": {"pin_on_top": False}})
    return {"status": 200, "message": "Successfully pin the event"}
