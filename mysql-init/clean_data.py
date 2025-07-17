import pandas as pd
import numpy as np
import os

# 1. Load the CSV (assuming fullsports.csv is also accessible from current working directory or specified path)
df = pd.read_csv('fullsports.csv', na_values=['N/A', 'n/a', '', 'NA', '-'])

# 2. Remove commas in 'Price (in USD)' and convert to numeric
df['Price (in USD)'] = df['Price (in USD)'].str.replace(',', '', regex=False)
df['Price (in USD)'] = pd.to_numeric(df['Price (in USD)'], errors='coerce')

# 3. Make sure any other problematic columns (like Engine Size) are handled
df['Engine Size (L)'] = pd.to_numeric(df['Engine Size (L)'], errors='coerce')

# 4. isElectric is true if engine size is null and false otherwise
df['isElectric'] = df['Engine Size (L)'].isna()

# 4. Save cleaned CSV to the project root
# Get the directory of the current script
script_dir = os.path.dirname(__file__)
# Go up one level to the project root (assuming script is one level down from root)
project_root = os.path.join(script_dir, os.pardir)
# Define the full path for the output CSV
output_path = os.path.join(project_root, 'cleanedsports.csv')

df.to_csv(output_path, index=False)

# Optional: display some info
# print(df.info())
# print(df.head())