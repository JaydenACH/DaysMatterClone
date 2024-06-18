from pymongo import MongoClient, DESCENDING, ASCENDING
from dotenv import load_dotenv, find_dotenv
import os
from bson.objectid import ObjectId


load_dotenv(find_dotenv())
password = os.environ.get("MONGO_PWD")
connection_string = (
    f"mongodb+srv://angchunhang:{password}@daysmatter.gzrfyzd.mongodb.net/"
)
client = MongoClient(connection_string)

dbs = client.list_database_names()
daysmatter_db = client.daysmatter_db
collection = daysmatter_db.daysmatter


def insert_event_doc(data) -> bool:
    collection.insert_one(data).inserted_id
    return True


def get_event_docs() -> list:
    events = collection.find().sort(
        [
            ("ongoing", DESCENDING),
            ("pin_on_top", DESCENDING),
            ("start_date", DESCENDING),
        ]
    )
    return list(events)


def update_event_docs(event_id: str, updated_event: dict):
    _id = ObjectId(event_id)
    collection.update_one({"_id": _id}, {"$set": updated_event})


def delete_event_docs(event_id: str):
    _id = ObjectId(event_id)
    collection.delete_one({"_id": _id})


def pin_event_doc(event_id: str):
    _id = ObjectId(event_id)
    event = collection.find_one({"_id": _id})
    if not event.get("pin_on_top"):
        collection.update_one({"_id": _id}, {"$set": {"pin_on_top": True}})
        collection.update_many(
            {"pin_on_top": True, "_id": {"$ne": _id}}, {"$set": {"pin_on_top": False}}
        )
    else:
        collection.update_many({"pin_on_top": True}, {"$set": {"pin_on_top": False}})
