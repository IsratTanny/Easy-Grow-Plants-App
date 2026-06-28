from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import random
import time

app = FastAPI(title="Easy Grow Plants IoT & AI Microservice")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class SensorData(BaseModel):
    device_id: str
    moisture: float
    temp: float
    water_level: float

class ChatRequest(BaseModel):
    message: str

# Mock Database for demo purposes (In production, this would replicate to the main DB or use a shared one)
device_states = {}

@app.post("/api/sensor-data")
def receive_sensor_data(data: SensorData):
    # In a real app, save to Postgres here
    print(f"Received data from {data.device_id}: {data}")
    return {"status": "success", "data": data}

@app.get("/api/control-pump/{device_id}")
def toggle_pump(device_id: str):
    # Toggle state
    current_state = device_states.get(device_id, False)
    new_state = not current_state
    device_states[device_id] = new_state
    
    status_str = "ON" if new_state else "OFF"
    return {"device_id": device_id, "pump_status": status_str}

@app.post("/api/chat")
def chat_with_bot(request: ChatRequest):
    user_msg = request.message.lower()
    
    # Mock AI Logic
    if "water" in user_msg:
        response = "Most indoor plants need watering when the top inch of soil is dry. Check your specific plant's needs!"
    elif "sun" in user_msg or "light" in user_msg:
        response = "Ensure your plant gets adequate light. South-facing windows are usually best for high-light plants."
    elif "yellow" in user_msg:
        response = "Yellow leaves can indicate overwatering or nutrient deficiency. Check the soil moisture first."
    else:
        response = "I'm a botanical expert AI. Ask me about watering, sunlight, or plant health!"
        
    time.sleep(1) # Simulate AI processing delay
    return {"response": response, "confidence": 0.95}

@app.post("/api/diagnose")
def diagnose_plant():
    # In a real app, this would handle file upload and process with a CV model
    # Returning a mock response for now
    diseases = ["Leaf Spot", "Root Rot", "Powdery Mildew", "Healthy"]
    diagnosis = random.choice(diseases)
    confidence = random.randint(70, 99)
    
    return {
        "diagnosis": diagnosis,
        "confidence": f"{confidence}%",
        "recommendation": "Isolate the plant and check humidity levels." if diagnosis != "Healthy" else "Keep up the good work!"
    }
