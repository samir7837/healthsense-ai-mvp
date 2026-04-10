# ml/model.py

"""
HealthSense AI - ML Risk Prediction Module (MVP)

NOTE:
This is a lightweight rule-based model to simulate ML behavior.
Designed to be easily replaceable with real ML models (LSTM, XGBoost).
"""

def predict_risk(bpm, previous_bpm=None):
    """
    Predict patient risk based on heart rate (BPM)

    Args:
        bpm (int): current heart rate
        previous_bpm (int, optional): previous heart rate for trend detection

    Returns:
        dict: risk level, reason, and score
    """

    # Input validation
    if bpm is None or bpm <= 0:
        return {
            "risk": "ERROR",
            "reason": "Invalid BPM value",
            "score": 0
        }

    # Default values
    risk = "NORMAL"
    reason = "Heart rate within normal range"
    score = 0.2

    # Rule-based logic (simulating ML)
    if bpm < 50:
        risk = "HIGH RISK"
        reason = "Heart rate critically low (possible bradycardia)"
        score = 0.9

    elif 50 <= bpm < 60:
        risk = "WARNING"
        reason = "Heart rate slightly below normal"
        score = 0.6

    elif 60 <= bpm <= 100:
        risk = "NORMAL"
        reason = "Heart rate stable and normal"
        score = 0.2

    elif 100 < bpm <= 120:
        risk = "WARNING"
        reason = "Elevated heart rate detected (possible stress)"
        score = 0.65

    elif bpm > 120:
        risk = "HIGH RISK"
        reason = "Heart rate critically high (possible tachycardia)"
        score = 0.95

    # Trend detection (bonus for judges)
    if previous_bpm is not None:
        if bpm > previous_bpm:
            reason += " | Rising trend observed"
            score += 0.05
        elif bpm < previous_bpm:
            reason += " | Falling trend observed"

    return {
        "bpm": bpm,
        "risk": risk,
        "reason": reason,
        "score": round(score, 2)
    }


# Quick test (run file directly)
if __name__ == "__main__":
    test_values = [45, 55, 75, 105, 130]

    for bpm in test_values:
        result = predict_risk(bpm)
        print(result)