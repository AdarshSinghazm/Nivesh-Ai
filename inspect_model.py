import pickle
import sys
import os

def inspect_pickle(file_path):
    print(f"\n--- Inspecting {os.path.basename(file_path)} ---")
    try:
        with open(file_path, 'rb') as f:
            data = pickle.load(f)
            print(f"Type: {type(data)}")
            print(f"Content: {data}")
            if hasattr(data, 'feature_names_in_'):
                print(f"Features expected: {data.feature_names_in_}")
            if hasattr(data, 'n_features_in_'):
                print(f"Number of features: {data.n_features_in_}")
    except Exception as e:
        print(f"Error reading {file_path}: {e}")

if __name__ == "__main__":
    base_path = "ml_model"
    inspect_pickle(os.path.join(base_path, "features.pkl"))
    inspect_pickle(os.path.join(base_path, "stock_model.pkl"))
