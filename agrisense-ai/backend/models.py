from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

# Common Fields
class TimestampedModel(BaseModel):
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

# User Models
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str = "Farmer"  # "Farmer" or "Admin"

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str


class UserInDB(UserCreate, TimestampedModel):
    hashed_password: str

class UserOut(TimestampedModel):
    id: str
    username: str
    email: EmailStr
    role: str

# Farm Models
class FarmCreate(BaseModel):
    name: str
    location: str
    crop_type: str
    area_hectares: float

class FarmInDB(FarmCreate, TimestampedModel):
    id: str
    user_id: str

# Crop Image Models
class CropImageCreate(BaseModel):
    farm_id: str
    image_url: str

class CropImageInDB(CropImageCreate, TimestampedModel):
    id: str
    health_status: Optional[str] = None
    confidence: Optional[float] = None
    treatment_suggestion: Optional[str] = None

# NDVI Models
class NdviResultCreate(BaseModel):
    farm_id: str
    red_band_url: str
    nir_band_url: str

class NdviResultInDB(NdviResultCreate, TimestampedModel):
    id: str
    ndvi_value: float
    health_classification: str
    heatmap_url: Optional[str] = None

# Sensor Simulation Models
class SensorSimulationCreate(BaseModel):
    farm_id: str
    soil_moisture: float
    ph: float
    temperature: float
    humidity: float

class SensorSimulationInDB(SensorSimulationCreate, TimestampedModel):
    id: str

# Pest Prediction Models
class PestPredictionCreate(BaseModel):
    farm_id: str

class PestPredictionInDB(PestPredictionCreate, TimestampedModel):
    id: str
    risk_level: str # Low, Medium, High
    probability_score: float

# Recommendation Models
class RecommendationCreate(BaseModel):
    farm_id: str
    irrigation_advice: str
    fertilizer_recommendation: str
    pesticide_suggestion: str

class RecommendationInDB(RecommendationCreate, TimestampedModel):
    id: str

# Alert Models
class AlertCreate(BaseModel):
    farm_id: str
    message: str
    severity: str # Info, Warning, Critical

class AlertInDB(AlertCreate, TimestampedModel):
    id: str
    is_read: bool = False
