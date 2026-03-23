import sys
import pandas as pd
import numpy as np
import json
import warnings
import os
import joblib

# Suppress warnings
warnings.filterwarnings("ignore")

def load_model():
    # Use absolute path or relative to script execution
    # Next.js API route will execute this, so path needs to be robust
    model_path = os.path.join(os.path.dirname(__file__), 'ml_model', 'stock_model.pkl')
    try:
        # User's model was saved with joblib, not pickle
        model = joblib.load(model_path)
        return model
    except FileNotFoundError:
        print(json.dumps({"error": f"Model file not found at {model_path}"}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": f"Error loading model: {str(e)}"}))
        sys.exit(1)

def load_stock_data(symbol):
    """
    Load historical data for a specific stock from the processed CSVs.
    """
    if not symbol:
        return None
        
    # Sanitize symbol
    safe_symbol = str(symbol).replace('/', '_').replace('\\', '_')
    file_path = os.path.join(os.path.dirname(__file__), 'ml_model', 'stock_data', f"{safe_symbol}.csv")
    
    if not os.path.exists(file_path):
        return None
        
    try:
        df = pd.read_csv(file_path)
        return df
    except Exception:
        return None

def calculate_features(prices, volumes):
    """
    Calculate features expected by the model: ['MA20', 'Return', 'Volatility', 'Volume']
    """
    if len(prices) != len(volumes):
        raise ValueError("Prices and volumes length mismatch")

    df = pd.DataFrame({'Close': prices, 'Volume': volumes})
    
    # Calculate MA20 (20-day Moving Average)
    df['MA20'] = df['Close'].rolling(window=20).mean()
    
    # Calculate Return (Daily Return)
    df['Return'] = df['Close'].pct_change()
    
    # Calculate Volatility (20-day standard deviation of returns)
    df['Volatility'] = df['Return'].rolling(window=20).std()
    
    # Fill NaN values (resulting from rolling windows)
    # For prediction, we need the latest valid data point
    # We strip the initial NaNs 
    df.dropna(inplace=True)
    
    if df.empty:
        raise ValueError("Not enough data to calculate technical indicators (need >20 points)")

    # Get the latest row for prediction
    # We want to predict for the *next* day, so we use the latest available data
    latest = df.iloc[-1]
    
    # Construct feature array in correct order
    # Feature order MUST match training: ['MA20', 'Return', 'Volatility', 'Volume']
    features = np.array([[
        latest['MA20'],
        latest['Return'],
        latest['Volatility'],
        latest['Volume']
    ]])
    
    return features, latest

def main():
    try:
        # Read input JSON from stdin
        # Expected format: {"prices": [...], "volumes": [...], "symbol": "..."}
        input_data = sys.stdin.read()
        if not input_data:
            print(json.dumps({"error": "No input data provided"}))
            return

        data = json.loads(input_data)
        prices = data.get('prices', [])
        volumes = data.get('volumes', [])
        symbol = data.get('symbol', None)
        
        # If symbol is provided, try to load real data
        if symbol:
            stock_df = load_stock_data(symbol)
            if stock_df is not None:
                # Use the last 50 days (enough for MA20 + buffer)
                # Ensure we have enough data
                if len(stock_df) > 50:
                    stock_df = stock_df.tail(50)
                
                prices = stock_df['Close'].tolist()
                volumes = stock_df['Volume'].tolist()
        
        # Validate data length (need at least 21 points for 20-day rolling + 1 diff)
        if len(prices) < 21:
             print(json.dumps({"error": f"Need at least 21 historical data points to calculate MA20 & Volatility. Got {len(prices)}."}))
             return

        # Load model
        model = load_model()
        
        # Prepare features
        features, latest_data = calculate_features(prices, volumes)
        
        # Predict
        prediction = model.predict(features)[0]
        
        # Output result as JSON
        print(json.dumps({
            "prediction": prediction,
            "features": {
                "MA20": latest_data['MA20'],
                "Return": latest_data['Return'],
                "Volatility": latest_data['Volatility'],
                "Volume": latest_data['Volume']
            },
            "last_price": prices[-1],
            "historical_data": {
                "prices": prices[-30:], # Return last 30 days for visualization if needed
                "volumes": volumes[-30:]
            }
        }))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
