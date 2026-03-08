from fastapi import APIRouter, Depends, HTTPException
from database import farms_collection
from models import FarmCreate, FarmInDB
from auth import get_current_user
from bson import ObjectId

router = APIRouter()

@router.post("/")
async def create_farm(farm: FarmCreate, current_user: dict = Depends(get_current_user)):
    farm_dict = farm.dict()
    db_farm = FarmInDB(**farm_dict, user_id=current_user["id"])
    new_farm = await farms_collection.insert_one(db_farm.dict())
    return {"message": "Farm created", "id": str(new_farm.inserted_id)}

@router.get("/")
async def get_farms(current_user: dict = Depends(get_current_user)):
    # if admin, maybe all? if farmer, only theirs
    query = {"user_id": current_user["id"]} if current_user["role"] != "Admin" else {}
    farms = []
    async for f in farms_collection.find(query):
        f["_id"] = str(f["_id"])
        farms.append(f)
    return {"farms": farms}

@router.get("/{farm_id}")
async def get_farm(farm_id: str, current_user: dict = Depends(get_current_user)):
    farm = await farms_collection.find_one({"_id": ObjectId(farm_id)})
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    if current_user["role"] != "Admin" and farm["user_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    farm["_id"] = str(farm["_id"])
    return farm
