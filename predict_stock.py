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

def calculate_rsi(prices, period=14):
    """
    Calculate Relative Strength Index (RSI)
    """
    if len(prices) < period + 1:
        return 50.0
    
    delta = pd.Series(prices).diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return float(rsi.iloc[-1])

def calculate_technical_indicators(prices):
    """
    Calculate SMA, EMA, and RSI for the UI
    """
    df = pd.DataFrame({'Close': prices})
    
    # Simple Moving Averages
    sma20 = df['Close'].rolling(window=20).mean().iloc[-1]
    sma50 = df['Close'].rolling(window=min(50, len(df))).mean().iloc[-1]
    
    # RSI
    rsi = calculate_rsi(prices)
    
    # Trend
    trend = "bullish" if prices[-1] > sma20 else "bearish"
    
    # Support/Resistance (Pivot points estimate)
    support = float(np.min(prices[-20:]))
    resistance = float(np.max(prices[-20:]))
    
    return {
        "rsi": round(rsi, 2),
        "sma20": round(float(sma20), 2),
        "sma50": round(float(sma50), 2),
        "trend": trend,
        "support": round(support, 2),
        "resistance": round(resistance, 2)
    }

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
        
        # Calculate real-time technical indicators
        tech_indicators = calculate_technical_indicators(prices)
        
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
            "technical_analysis": tech_indicators,
            "last_price": prices[-1],
            "historical_data": {
                "prices": prices[-30:], 
                "volumes": volumes[-30:]
            },
            "forecast": generate_30_day_forecast(prices[-1], prediction, latest_data['Volatility'])
        }))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

def generate_30_day_forecast(current_price, predicted_return, volatility):
    """
    Generates a 30-day "wiggly" price forecast with upper and lower bounds.
    """
    import random
    forecast = []
    
    # daily_drift is the total predicted move spread across 30 days
    daily_drift = float(predicted_return) / 30.0
    
    # daily_vol is the standard deviation for the "wiggly" effect
    # We use the volatility feature (which is usually a rolling std)
    daily_vol = float(volatility) / (30.0 ** 0.5)
    
    last_p = current_price
    last_up = current_price
    last_low = current_price
    
    for i in range(1, 41): # 40 points for a smoother chart connection
        # Add some random noise for "wiggliness"
        noise = random.gauss(0, daily_vol)
        
        # Calculate next price points
        # Main forecast follows the drift + noise
        next_p = last_p * (1 + daily_drift + noise)
        
        # Upper/Lower bounds use a wider volatility spread (e.g., 2 standard deviations)
        next_up = last_up * (1 + daily_drift + (daily_vol * 1.5)) 
        next_low = last_low * (1 + daily_drift - (daily_vol * 1.5))
        
        forecast.append({
            "day": f"D+{i}",
            "price": float(round(next_p, 2)),
            "upper": float(round(next_up, 2)),
            "lower": float(round(next_low, 2))
        })
        
        last_p = next_p
        last_up = next_up
        last_low = next_low
        
    return forecast

if __name__ == "__main__":
    main()
