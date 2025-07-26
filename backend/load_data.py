import pandas as pd
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base

# create all tables
Base.metadata.create_all(bind=engine)

def load_csvs():
    db = SessionLocal()
    csv_files = ["orders.csv", "products.csv", "customers.csv"]  # replace with your files
    for file in csv_files:
        df = pd.read_csv(file)
        print(f"Loaded {file} with {len(df)} rows")
        # you can write logic here to push to relevant DB tables
    db.close()

if __name__ == "__main__":
    load_csvs()
