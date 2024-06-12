from pymongo import MongoClient
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
collections = daysmatter_db.list_collection_names()


def insert_event_doc(data) -> bool:
    collection = daysmatter_db.daysmatter
    collection.insert_one(data).inserted_id
    return True


def get_event_docs() -> list:
    collection = daysmatter_db.daysmatter
    events = collection.find()
    return list(events)


def update_event_docs(event_id: str, updated_event: dict):
    collection = daysmatter_db.daysmatter
    _id = ObjectId(event_id)
    collection.update_one({"_id": _id}, {"$set": updated_event})


def delete_event_docs(event_id: str):
    collection = daysmatter_db.daysmatter
    _id = ObjectId(event_id)
    collection.delete_one({"_id": _id})
