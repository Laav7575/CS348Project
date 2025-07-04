import pandas as pd
import numpy as np

# 1. Load the CSV
df = pd.read_csv('fullspors.csv', na_values=['N/A', 'n/a', '', 'NA', '-'])

# 2. Remove commas in 'Price (in USD)' and convert to numeric
df['Price (in USD)'] = df['Price (in USD)'].str.replace(',', '', regex=False)
df['Price (in USD)'] = pd.to_numeric(df['Price (in USD)'], errors='coerce')

# 3. Make sure any other problematic columns (like Engine Size) are handled
df['Engine Size (L)'] = pd.to_numeric(df['Engine Size (L)'], errors='coerce')

# 4. Save cleaned CSV
df.to_csv('your_file_cleaned.csv', index=False)

# Optional: display some info
print(df.info())
print(df.head())
