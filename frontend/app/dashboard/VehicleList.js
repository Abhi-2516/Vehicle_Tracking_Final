'use client';
import { useEffect, useState, useRef } from 'react';
import '../../styles/vehiclelist.css';

export default function VehicleList() {
    const [vehicles, setVehicles] = useState([]); // Store vehicles
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nextCursor, setNextCursor] = useState(null); // Cursor for pagination
    const observerRef = useRef(null); // Reference to track the last element

    useEffect(() => {
        fetchVehicles();

        // Setup polling for real-time updates (Optional)
        const interval = setInterval(fetchVehicles, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    // Fetch vehicles from API
    const fetchVehicles = async () => {
        if (loading) return;
        setLoading(true);

        let url = `http://localhost:5000/api/vehicles?limit=5`;
        if (nextCursor) url += `&cursor=${nextCursor}`;

        try {
            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!res.ok) throw new Error('Failed to fetch vehicles');

            const data = await res.json();

            if (!data.vehicles || !Array.isArray(data.vehicles)) {
                throw new Error('Unexpected response format');
            }

            setVehicles((prev) => {
                const uniqueVehicles = new Map();
                data.vehicles.forEach(vehicle => uniqueVehicles.set(vehicle._id, vehicle));
                prev.forEach(vehicle => uniqueVehicles.set(vehicle._id, vehicle));
                return Array.from(uniqueVehicles.values());
            });

            setNextCursor(data.nextCursor || null); // Store next cursor

        } catch (error) {
            console.error('Fetch error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Infinite Scroll Observer
    useEffect(() => {
        if (!nextCursor || loading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchVehicles();
                }
            },
            { threshold: 1.0 } // Trigger when fully visible
        );

        if (observerRef.current) observer.observe(observerRef.current);

        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [nextCursor, loading]);

    return (
        <div className="vehicle-container">
            <h2 className="vehicle-heading">Registered Vehicles</h2>

            {error && <p className="error-message">{error}</p>}
            {vehicles.length === 0 && !loading && !error && <p className="text-center text-gray-500">No vehicles found.</p>}

            <div className="vehicle-card-grid">
                {vehicles.map((vehicle, index) => (
                    <div key={vehicle._id} className="vehicle-card" ref={index === vehicles.length - 1 ? observerRef : null}>
                        <div className="vehicle-type">{vehicle.type}</div>
                        <h3 className="vehicle-title">{vehicle.licenseNumber}</h3>
                        <p className="vehicle-info"><strong>Owner:</strong> {vehicle.ownerName || 'N/A'}</p>
                        <p className="vehicle-info"><strong>Contact:</strong> {vehicle.ownerContact || 'N/A'}</p>
                        <p className="vehicle-info">
                            <strong>Location:</strong> {vehicle.location ? `${vehicle.location.latitude}, ${vehicle.location.longitude}` : 'Unknown'}
                        </p>
                    </div>
                ))}
            </div>

            {loading && <div className="text-center py-10 text-gray-500">Loading more vehicles...</div>}
        </div>
    );
}
