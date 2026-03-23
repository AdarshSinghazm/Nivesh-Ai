import pandas as pd
import os
import shutil

def process_dataset():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    input_file = os.path.join(base_dir, 'ml_model', 'training_dataset.csv')
    output_dir = os.path.join(base_dir, 'ml_model', 'stock_data')

    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found.")
        return

    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created directory: {output_dir}")
    else:
        # Clear existing data to ensure freshness
        shutil.rmtree(output_dir)
        os.makedirs(output_dir)
        print(f"Cleaned and recreated directory: {output_dir}")

    print("Loading dataset... this might take a moment.")
    try:
        df = pd.read_csv(input_file)
        
        # Ensure Date is parsed (optional, but good for sorting)
        if 'Date' in df.columns:
            df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
            df.sort_values(by='Date', inplace=True)

        # Get unique stocks
        stocks = df['Stock'].unique()
        print(f"Found {len(stocks)} unique stocks.")

        count = 0
        for stock in stocks:
            if pd.isna(stock):
                continue
            
            # Filter data for this stock
            stock_df = df[df['Stock'] == stock]
            
            # Save to individual CSV
            # Sanitize filename just in case
            safe_name = str(stock).replace('/', '_').replace('\\', '_')
            output_path = os.path.join(output_dir, f"{safe_name}.csv")
            
            stock_df.to_csv(output_path, index=False)
            count += 1
            
        print(f"Successfully processed {count} stocks. Data saved to {output_dir}")

    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    process_dataset()
