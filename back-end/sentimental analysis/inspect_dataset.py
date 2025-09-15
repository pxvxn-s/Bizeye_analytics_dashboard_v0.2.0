import pandas as pd
import matplotlib.pyplot as plt

# Step 1: Load your dataset
file_path =r"C:\My Projects\BizEye\amazon.csv"
df = pd.read_csv(file_path)

# Step 2: Quick overview
print(" Dataset Info:\n")
print(df.info())
print("\n First 5 rows:\n")
print(df.head())

# Step 3: Check missing values
print("\n Missing values per column:")
print(df.isnull().sum())

# Step 4: Check for duplicates
print(f"\n Duplicate rows: {df.duplicated().sum()}")

# Step 5: Unique products (if product column exists)
if 'product_name' in df.columns or 'Product Name' in df.columns:
    col = 'product_name' if 'product_name' in df.columns else 'Product Name'
    print(f"\n Unique products: {df[col].nunique()}")

# Step 6: Star rating distribution (if present)
possible_cols = ['rating', 'stars', 'star_rating']
for col in possible_cols:
    if col in df.columns:
        plt.figure(figsize=(6,4))
        df[col].value_counts().sort_index().plot(kind='bar', color='skyblue')
        plt.title(" Rating Distribution")
        plt.xlabel("Star Rating")
        plt.ylabel("Number of Reviews")
        plt.grid(axis='y')
        plt.tight_layout()
        plt.show()
        break
