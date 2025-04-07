import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function App() {
  const [formData, setFormData] = useState({ dish: '', quantity_wasted: '', estimated_cost: '' });
  const [dishData, setDishData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await axios.post('http://localhost:5000/submit', formData);
    alert('Submitted!');
    fetchCharts();
  };

  const downloadReport = async () => {
    const response = await axios.get('http://localhost:5000/report', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'food_waste_report.csv');
    document.body.appendChild(link);
    link.click();
  };

  const fetchCharts = async () => {
    const res = await axios.get('http://localhost:5000/charts-data');
    setDishData(res.data.dish_data);
    setHourlyData(res.data.hourly_data);
  };

  useEffect(() => {
    fetchCharts();
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Food Waste Submission</h1>
      <input className="border p-2 w-full mb-2" name="dish" placeholder="Dish" onChange={handleChange} />
      <input className="border p-2 w-full mb-2" name="quantity_wasted" placeholder="Quantity Wasted" onChange={handleChange} />
      <input className="border p-2 w-full mb-2" name="estimated_cost" placeholder="Estimated Cost" onChange={handleChange} />
      <button className="bg-blue-500 text-white p-2 w-full mb-4" onClick={handleSubmit}>Submit</button>
      <button className="bg-green-500 text-white p-2 w-full mb-4" onClick={downloadReport}>Download Report</button>

      {dishData.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-6 mb-2">💸 Cost by Dish</h2>
          <Bar
            data={{
              labels: dishData.map(d => d.dish),
              datasets: [{ label: 'Total Cost ($)', data: dishData.map(d => d.total_cost) }]
            }}
          />
        </>
      )}

      {hourlyData.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-6 mb-2">⏰ Waste Volume by Hour</h2>
          <Bar
            data={{
              labels: hourlyData.map(h => `Hour ${h.hour}`),
              datasets: [{ label: 'Quantity Wasted', data: hourlyData.map(h => h.waste_count) }]
            }}
          />
        </>
