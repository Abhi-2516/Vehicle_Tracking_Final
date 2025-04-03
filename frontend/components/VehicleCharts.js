'use client';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function VehicleCharts() {
    const [chartData, setChartData] = useState(null);
    const [topVehicles, setTopVehicles] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        if (!token) {
            setError("User is not authenticated. Please log in.");
            setLoading(false);
            return;
        }

        fetchDistanceData();
        fetchTopVehicles();
    }, [token]);

    // Fetch total distance per vehicle
    async function fetchDistanceData() {
        try {
            const res = await fetch('http://localhost:5000/api/vehicles/distance', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch distance data: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();

            if (Array.isArray(data) && data.length > 0) {
                setChartData({
                    labels: data.map(vehicle => vehicle.ownerName), // Using ownerName instead of vehicle ID
                    datasets: [{
                        label: 'Total Distance (km)',
                        data: data.map(vehicle => vehicle.totalDistance),
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                });
            } else {
                setError("No distance data available.");
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    // Fetch top 10 vehicles by distance
    async function fetchTopVehicles() {
        try {
            const res = await fetch('http://localhost:5000/api/vehicles/top', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch top vehicles: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();

            if (Array.isArray(data) && data.length > 0) {
                setTopVehicles(data);
            } else {
                setError("No top vehicles data available.");
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: '800px', margin: '20px auto', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ color: '#333' }}>Vehicle Distance Analytics</h2>

            {loading ? (
                <p style={{ color: '#777' }}>Loading data...</p>
            ) : error ? (
                <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>
            ) : (
                <>
                    {chartData ? (
                        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                            <h3 style={{ color: '#555' }}>Total Distance Per Vehicle</h3>
                            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                        </div>
                    ) : (
                        <p style={{ color: '#777' }}>No distance data available.</p>
                    )}

                    {topVehicles ? (
                        <div style={{
                            background: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            textAlign: 'left'
                        }}>
                            <h3 style={{ color: '#555' }}>Top 10 Vehicles by Distance</h3>
                            <ul style={{ listStyleType: 'none', padding: '0' }}>
                                {topVehicles.map((vehicle, index) => (
                                    <li key={index} style={{
                                        background: index % 2 === 0 ? '#e9ecef' : '#dee2e6',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        margin: '5px 0'
                                    }}>
                                        <strong>{vehicle.ownerName}</strong> - {vehicle.totalDistance} km
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p style={{ color: '#777' }}>No top vehicles data available.</p>
                    )}
                </>
            )}
        </div>
    );
}
