import os
import pandas as pd
import json

def get_latest_prices():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, 'ml_model', 'stock_data')
    
    if not os.path.exists(data_dir):
        print(json.dumps({"error": "Data directory not found"}))
        return

    results = []
    files = [f for f in os.listdir(data_dir) if f.endswith('.csv')]
    
    for file in files:
        symbol = file.replace('.csv', '')
        file_path = os.path.join(data_dir, file)
        try:
            df = pd.read_csv(file_path)
            if not df.empty:
                latest_price = df.iloc[-1]['Close']
                date = df.iloc[-1]['Date']
                results.append({
                    "symbol": symbol,
                    "latest_price": float(latest_price),
                    "date": str(date)
                })
        except Exception:
            continue
            
    # Sort by symbol
    results.sort(key=lambda x: x['symbol'])
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    get_latest_prices()
