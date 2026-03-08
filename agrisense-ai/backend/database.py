import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB Configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/agrisense_db")

# ─── Improved DB Name Parsing ──────────────────────────────────────────────────
# Handles: mongodb+srv://.../dbname?retryWrites=true
try:
    path_part = MONGODB_URL.split('/')[-1]
    db_name = path_part.split('?')[0] if '?' in path_part else path_part
    if not db_name:
        db_name = "agrisense_db"
except:
    db_name = "agrisense_db"

client = AsyncIOMotorClient(MONGODB_URL)
db = client[db_name]

# ─── Collections ─────────────────────────────────────────────────────────────
users_collection              = db.users
farms_collection              = db.farms
crop_images_collection        = db.crop_images
ndvi_results_collection       = db.ndvi_results
sensor_simulations_collection = db.sensor_simulations
pest_predictions_collection   = db.pest_predictions
recommendations_collection    = db.recommendations
alerts_collection             = db.alerts

# Stores password-reset tokens: {token, username, email, expires}
reset_tokens_collection       = db.reset_tokens

print(f"[*] Connected to MongoDB: {MONGODB_URL}")