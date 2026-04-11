import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib

data = []

for _ in range(1000):
    bpm = np.random.randint(40, 140)
    spo2 = np.random.randint(80, 100)

    if spo2 < 90:
        label = "Hypoxia"
    elif bpm < 60:
        label = "Bradycardia"
    elif bpm > 110:
        label = "Tachycardia"
    elif 90 <= bpm <= 110:
        label = "Stress"
    else:
        label = "Normal"

    data.append([bpm, spo2, label])

df = pd.DataFrame(data, columns=["bpm", "spo2", "label"])

X = df[["bpm", "spo2"]]
y = df["label"]

model = RandomForestClassifier()
model.fit(X, y)

joblib.dump(model, "ml/ml_model.pkl")

print("✅ Model trained and saved")