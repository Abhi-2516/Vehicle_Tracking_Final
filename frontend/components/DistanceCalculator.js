'use client';
import { useState } from 'react';

export default function DistanceCalculator({ vehicles }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateDistance = async () => {
    if (!from || !to || from === to) {
      alert('Please select two different vehicles.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/distance?from=${from}&to=${to}`
      );
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        alert(data.msg || 'Error calculating distance');
      }
    } catch (err) {
      alert('Something went wrong');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white border rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-semibold mb-4 text-blue-600">Calculate Distance & Time</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Vehicle A</option>
          {vehicles.map((v) => (
            <option key={v._id} value={v._id}>
              {v.licenseNumber}
            </option>
          ))}
        </select>

        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Vehicle B</option>
          {vehicles.map((v) => (
            <option key={v._id} value={v._id}>
              {v.licenseNumber}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={calculateDistance}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Calculating...' : 'Calculate Distance'}
      </button>

      {result && (
        <div className="mt-4 text-green-700 font-medium">
          📍 Distance: {result.distance} <br />
          🕒 Estimated Time: {result.duration}
        </div>
      )}
    </div>
  );
}
