from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from ml.model import predict_risk

app = FastAPI()

# Allow frontend (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store latest data
latest_data = {
    "bpm": None,
    "risk": None,
    "reason": None,
    "score": None
}

# Request schema
class BPMData(BaseModel):
    bpm: int


@app.get("/")
def home():
    return {"message": "HealthSense AI Backend Running 🚀"}


@app.post("/data")
def receive_data(data: BPMData):
    global latest_data

    result = predict_risk(data.bpm)

    latest_data = result

    return result


@app.get("/status")
def get_status():
    return latest_data



