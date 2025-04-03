'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VehicleForm from './VehicleForm';
import VehicleList from './VehicleList';
import dynamic from 'next/dynamic';
import VehicleCharts from '@/components/VehicleCharts';

const VehicleMap = dynamic(() => import('../../components/VehicleMap'), { ssr: false });

import '../../styles/dashboard.css';

export default function Dashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Distance calculation states
    const [vehicle1, setVehicle1] = useState('');
    const [vehicle2, setVehicle2] = useState('');
    const [distanceData, setDistanceData] = useState(null);

    const fetchVehicles = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Token is missing or invalid.");
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/vehicles', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Vehicle fetch error:", errorData);
                throw new Error("Failed to fetch vehicles");
            }

            const data = await res.json();
            if (!data.vehicles || !Array.isArray(data.vehicles)) {
                throw new Error("Unexpected response format");
            }

            setVehicles(data.vehicles); // Use the correct key

        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!user && !token) {
            router.push('/login');
        } else {
            fetchVehicles();
        }
    }, [user]);

    // Handle distance calculation
    const handleCalculateDistance = async () => {
        if (!vehicle1 || !vehicle2) {
            alert("Please select both vehicles.");
            return;
        }
        if (vehicle1 === vehicle2) {
            alert("Please select different vehicles.");
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`http://localhost:5000/api/vehicles/distance/${vehicle1}/${vehicle2}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) throw new Error("Failed to calculate distance");
            const data = await res.json();

            setDistanceData({
                from: vehicle1,
                to: vehicle2,
                distance: data.distance,
                estimatedTime: data.duration
            });
        } catch (error) {
            console.error("Error calculating distance:", error);
            alert("Error calculating distance.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                {user ? (
                    <div className="welcome-card">
                        <h1 className="welcome-title">Welcome, {user.name}</h1>
                        <p className="welcome-message">
                            Here you can register vehicles, view them on the map, and much more.
                        </p>
                    </div>
                ) : (
                    <div className="loading-message">Loading...</div>
                )}

                {/* 🚗 Vehicle Registration Form */}
                <VehicleForm fetchVehicles={fetchVehicles} />

                {/* 📏 Distance Calculator Section */}
                <div className="distance-section bg-gray-100 p-4 rounded-lg shadow mb-6">
                    <h2 className="text-lg font-semibold mb-2">Calculate Distance Between Vehicles</h2>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <select className="border rounded p-2 w-full md:w-1/3" value={vehicle1} onChange={(e) => setVehicle1(e.target.value)}>
                            <option value="">Select Vehicle 1</option>
                            {Array.isArray(vehicles) && vehicles.map((v) => (
                                <option key={v._id} value={v._id}>{v.licenseNumber}</option>
                            ))}
                        </select>
                        <select className="border rounded p-2 w-full md:w-1/3" value={vehicle2} onChange={(e) => setVehicle2(e.target.value)}>
                            <option value="">Select Vehicle 2</option>
                            {Array.isArray(vehicles) && vehicles.map((v) => (
                                <option key={v._id} value={v._id}>{v.licenseNumber}</option>
                            ))}
                        </select>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleCalculateDistance}>Calculate</button>
                    </div>
                </div>

                <VehicleList />
                <VehicleMap vehicles={vehicles} />
                <VehicleCharts />
            </div>
            <Footer />
        </>
    );
}
