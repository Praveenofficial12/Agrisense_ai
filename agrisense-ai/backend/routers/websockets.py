import asyncio
import json
import random
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                pass

manager = ConnectionManager()

def generate_simulated_data():
    return {
        "soil_moisture": round(random.uniform(20.0, 80.0), 2),
        "ph": round(random.uniform(5.5, 8.5), 2),
        "temperature": round(random.uniform(15.0, 35.0), 2),
        "humidity": round(random.uniform(30.0, 90.0), 2),
        "npk_n": round(random.uniform(20.0, 100.0), 2),
        "npk_p": round(random.uniform(5.0, 70.0), 2),
        "npk_k": round(random.uniform(10.0, 90.0), 2),
    }

async def simulation_task(websocket: WebSocket, farm_id: str):
    try:
        while True:
            data = generate_simulated_data()
            data["farm_id"] = farm_id
            await websocket.send_text(json.dumps(data))
            await asyncio.sleep(3)   # update every 3 seconds (faster for demo)
    except (WebSocketDisconnect, Exception):
        manager.disconnect(websocket)

# Path is /ws/{farm_id} — included from main.py without extra prefix
@router.websocket("/ws/{farm_id}")
async def websocket_endpoint(websocket: WebSocket, farm_id: str):
    await manager.connect(websocket)
    try:
        await simulation_task(websocket, farm_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
