import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function App() {
  const [formData, setFormData] = useState({ dish: '', quantity_wasted: '', estimated_cost: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await axios.post('http://localhost:5000/submit', formData);
    alert('Submitted!');
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

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Food Waste Submission</h1>
      <input className="border p-2 w-full mb-2" name="dish" placeholder="Dish" onChange={handleChange} />
      <input className="border p-2 w-full mb-2" name="quantity_wasted" placeholder="Quantity Wasted" onChange={handleChange} />
      <input className="border p-2 w-full mb-2" name="estimated_cost" placeholder="Estimated Cost" onChange={handleChange} />
      <button className="bg-blue-500 text-white p-2 w-full mb-4" onClick={handleSubmit}>Submit</button>
      <button className="bg-green-500 text-white p-2 w-full" onClick={downloadReport}>Download Report</button>
    </div>
  );
}

export default App;
