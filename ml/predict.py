import joblib
import numpy as np

model = joblib.load("ml/ml_model.pkl")

def predict_risk(bpm, spo2):
    input_data = np.array([[bpm, spo2]])

    prediction = model.predict(input_data)[0]
    confidence = max(model.predict_proba(input_data)[0])

    return {
        "prediction": prediction,
        "confidence": round(float(confidence), 2)
    }