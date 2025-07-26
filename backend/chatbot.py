import pandas as pd
import re

# Load CSV files
products_df = pd.read_csv("backend/data/products.csv")
sales_df = pd.read_csv("backend/data/sales.csv")
inventory_df = pd.read_csv("backend/data/inventory.csv")
orders_df = pd.read_csv("backend/data/orders.csv")

# Merge product info with sales and inventory
product_info_df = pd.merge(products_df, sales_df, on="product_id")
product_info_df = pd.merge(product_info_df, inventory_df, on="product_id")

def handle_query(query):
    query = query.lower()

    # Query 1: "What are the top 5 most sold products?"
    if "top" in query and "sold" in query:
        top_products = product_info_df.sort_values(by="quantity_sold", ascending=False).head(5)
        result = [f"{row['name']} ({row['quantity_sold']} sold)" for _, row in top_products.iterrows()]
        return "Top 5 sold products:\n" + "\n".join(result)

    # Query 2: "Show me the status of order ID 12345"
    elif "status of order id" in query:
        match = re.search(r"\d+", query)
        if match:
            order_id = int(match.group())
            order_row = orders_df[orders_df['order_id'] == order_id]
            if not order_row.empty:
                status = order_row.iloc[0]['status']
                return f"Order ID {order_id} is currently: {status}."
            else:
                return f"No order found with ID {order_id}."
        return "Invalid order ID format."

    # Query 3: "How many Classic T-Shirts are left in stock?"
    elif "how many" in query and "left in stock" in query:
        for _, row in product_info_df.iterrows():
            if row['name'].lower() in query:
                return f"{row['name']} has {row['current_stock']} units left in stock."
        return "Sorry, product not found."

    return "Sorry, I couldn't understand your question."

