from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "fitness_db")

client = None
db = None

async def init_db():
    global client, db
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.notes.create_index("user_id")
    await db.notes.create_index([("created_at", -1)])
    
    print("Database initialized")

def get_db():
    return db
