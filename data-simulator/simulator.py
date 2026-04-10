import requests
import time
import random

URL = "http://localhost:8000/data"

def generate_bpm():
    return random.randint(60, 120)

def send_data():
    while True:
        bpm = generate_bpm()

        payload = {
            "bpm": bpm   # ✅ MUST match API contract
        }

        try:
            response = requests.post(URL, json=payload)

            if response.status_code == 200:
                data = response.json()
                print(f"Sent BPM: {bpm} | Response: {data.get('risk')}")
            else:
                print(f"Sent BPM: {bpm} | Error: {response.status_code}")

        except Exception as e:
            print(f" Backend not running: {e}")

        time.sleep(2)

if __name__ == "__main__":
    send_data()