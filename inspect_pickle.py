import pickle
import os
import sys

def inspect():
    model_path = os.path.join(os.path.dirname(__file__), 'ml_model', 'stock_model.pkl')
    print(f"Attempting to load: {model_path}")
    
    try:
        with open(model_path, 'rb') as f:
            content = f.read()
            print(f"File size: {len(content)} bytes")
            
            # Try loading
            f.seek(0)
            try:
                data = pickle.load(f)
                print("Success with default load!")
                print(f"Type: {type(data)}")
                return
            except Exception as e:
                print(f"Default load failed: {e}")
                
            # Try latin1
            f.seek(0)
            try:
                data = pickle.load(f, encoding='latin1')
                print("Success with latin1 load!")
                print(f"Type: {type(data)}")
                return
            except Exception as e:
                print(f"latin1 load failed: {e}")
                
    except Exception as e:
        print(f"File access error: {e}")

if __name__ == "__main__":
    inspect()
