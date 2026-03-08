import os
import httpx
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from auth import get_current_user

router = APIRouter()
AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://localhost:8001")

@router.post("/predict_disease")
async def predict_disease(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        async with httpx.AsyncClient() as client:
            files = {'file': (file.filename, await file.read(), file.content_type)}
            response = await client.post(f"{AI_SERVICE_URL}/predict/disease", files=files)
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="AI Service Error")
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict_pest")
async def predict_pest(
    data: dict,  # Expecting soil_moisture, temperature, humidity, historical
    current_user: dict = Depends(get_current_user)
):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{AI_SERVICE_URL}/predict/pest", json=data)
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="AI Service Error")
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/calculate_ndvi")
async def calculate_ndvi(
    red_image: UploadFile = File(...),
    nir_image: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        async with httpx.AsyncClient() as client:
            files = {
                'red_image': (red_image.filename, await red_image.read(), red_image.content_type),
                'nir_image': (nir_image.filename, await nir_image.read(), nir_image.content_type)
            }
            response = await client.post(f"{AI_SERVICE_URL}/predict/ndvi", files=files)
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="AI Service Error")
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recommendation")
async def get_recommendations(
    data: dict, # inputs like soil_moisture, crop_type, pest_risk, ndvi_score
    current_user: dict = Depends(get_current_user)
):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{AI_SERVICE_URL}/recommend", json=data)
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="AI Service Error")
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
