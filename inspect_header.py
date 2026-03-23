import os
import joblib
import binascii

model_path = os.path.join('ml_model', 'stock_model.pkl')

def inspect_header():
    with open(model_path, 'rb') as f:
        header = f.read(16)
        print(f"Header (hex): {binascii.hexlify(header)}")
        print(f"Header (text): {header}")

def try_joblib():
    print("\nAttempting joblib load...")
    try:
        model = joblib.load(model_path)
        print("Success with joblib!")
        print(f"Type: {type(model)}")
    except Exception as e:
        print(f"Joblib failed: {e}")

if __name__ == "__main__":
    inspect_header()
    try_joblib()
