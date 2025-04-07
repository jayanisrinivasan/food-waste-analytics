from flask import Flask, request, jsonify, send_file
from datetime import datetime
import pandas as pd
import os

app = Flask(__name__)
data_file = 'food_waste_data.csv'
report_file = 'food_waste_report.csv'

if not os.path.exists(data_file):
    df = pd.DataFrame(columns=['timestamp', 'dish', 'quantity_wasted', 'estimated_cost'])
    df.to_csv(data_file, index=False)

@app.route('/')
def index():
    return "Welcome to the Food Waste Analytics App"

@app.route('/submit', methods=['POST'])
def submit():
    content = request.get_json()
    timestamp = content.get('timestamp', datetime.now().isoformat())
    dish = content['dish']
    quantity_wasted = content['quantity_wasted']
    estimated_cost = content['estimated_cost']

    new_entry = pd.DataFrame([[timestamp, dish, quantity_wasted, estimated_cost]], 
                             columns=['timestamp', 'dish', 'quantity_wasted', 'estimated_cost'])
    new_entry.to_csv(data_file, mode='a', header=False, index=False)
    return jsonify({'message': 'Data submitted successfully'})

@app.route('/report', methods=['GET'])
def report():
    df = pd.read_csv(data_file)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['hour'] = df['timestamp'].dt.hour
    
    dish_summary = df.groupby('dish').agg(
        total_wasted=('quantity_wasted', 'sum'),
        total_cost=('estimated_cost', 'sum')
    ).sort_values(by='total_cost', ascending=False)

    hourly_summary = df.groupby('hour').agg(
        waste_count=('quantity_wasted', 'sum')
    ).sort_values(by='waste_count', ascending=False)

    dish_summary.to_csv('dish_summary.csv')
    hourly_summary.to_csv('hourly_summary.csv')

    summary = dish_summary.copy()
    summary['potential_savings'] = summary['total_cost'] * 0.8
    summary.to_csv(report_file)

    return send_file(report_file, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
