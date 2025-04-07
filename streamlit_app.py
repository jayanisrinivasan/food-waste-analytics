import streamlit as st
import pandas as pd
import os
from datetime import datetime
import altair as alt

DATA_FILE = 'food_waste_data.csv'
REPORT_FILE = 'food_waste_report.csv'

st.set_page_config(page_title='Food Waste Dashboard', layout='centered')

st.title("🍽️ Restaurant Food Waste Tracker")

# --- Data entry ---
st.header("Log Food Waste")

with st.form("waste_form"):
    dish = st.text_input("Dish Name")
    quantity = st.number_input("Quantity Wasted", min_value=0.0)
    cost = st.number_input("Estimated Cost ($)", min_value=0.0)
    submitted = st.form_submit_button("Submit Entry")

if submitted and dish:
    timestamp = datetime.now().isoformat()
    new_row = pd.DataFrame([[timestamp, dish, quantity, cost]],
                           columns=["timestamp", "dish", "quantity_wasted", "estimated_cost"])
    if os.path.exists(DATA_FILE):
        new_row.to_csv(DATA_FILE, mode='a', header=False, index=False)
    else:
        new_row.to_csv(DATA_FILE, index=False)
    st.success("Entry submitted!")

# --- Data visualization ---
if os.path.exists(DATA_FILE):
    st.header("📊 Waste Insights")

    df = pd.read_csv(DATA_FILE)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['hour'] = df['timestamp'].dt.hour

    # Summary by dish
    dish_summary = df.groupby('dish').agg(
        total_wasted=('quantity_wasted', 'sum'),
        total_cost=('estimated_cost', 'sum')
    ).reset_index()

    # Summary by hour
    hour_summary = df.groupby('hour').agg(
        waste_count=('quantity_wasted', 'sum')
    ).reset_index()

    col1, col2 = st.columns(2)
    with col1:
        st.subheader("💰 Cost by Dish")
        chart = alt.Chart(dish_summary).mark_bar().encode(
            x=alt.X('dish', sort='-y'),
            y='total_cost',
            tooltip=['dish', 'total_cost']
        ).properties(height=300)
        st.altair_chart(chart, use_container_width=True)

    with col2:
        st.subheader("⏰ Waste by Hour")
        chart2 = alt.Chart(hour_summary).mark_bar().encode(
            x='hour:O',
            y='waste_count',
            tooltip=['hour', 'waste_count']
        ).properties(height=300)
        st.altair_chart(chart2, use_container_width=True)

    # --- Downloadable report ---
    st.subheader("📥 Download Report")
    dish_summary['potential_savings'] = dish_summary['total_cost'] * 0.8
    dish_summary.to_csv(REPORT_FILE, index=False)
    with open(REPORT_FILE, 'rb') as f:
        st.download_button("Download CSV Report", f, file_name=REPORT_FILE, mime='text/csv')
else:
    st.info("No data yet. Log your first entry above!")

