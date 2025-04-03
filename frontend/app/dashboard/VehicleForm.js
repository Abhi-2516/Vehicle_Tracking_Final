'use client';
import { useState } from 'react';

export default function VehicleForm({ vehicles, setVehicles }) {
    const [form, setForm] = useState({
        licenseNumber: '',
        ownerName: '',
        ownerContact: '',
        type: 'Car',
        location: {
            latitude: '',
            longitude: '',
            manual: true,
        },
    });

    const [useLiveLocation, setUseLiveLocation] = useState(false);

    const handleLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setForm({
                    ...form,
                    location: {
                        latitude: parseFloat(latitude),
                        longitude: parseFloat(longitude),
                        manual: false,
                    },
                });
                setUseLiveLocation(true);
            },
            (err) => {
                alert('Could not retrieve location. Please enter manually.');
                console.error(err);
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
    
        const res = await fetch('http://localhost:5000/api/vehicles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(form),
        });
    
        const data = await res.json();
        console.log("Vehicle registration response:", data);
    
        if (res.ok) {
            alert('Vehicle registered!');
    
            // ✅ Fetch updated vehicle list instead of using setVehicles
            fetchVehicles();
    
            // ✅ Reset form
            setForm({
                licenseNumber: '',
                ownerName: '',
                ownerContact: '',
                type: 'Car',
                location: { latitude: '', longitude: '', manual: true },
            });
            setUseLiveLocation(false);
        } else {
            alert(data.msg || 'Failed to register');
        }
    };
    

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', width: '50%', margin: 'auto', backgroundColor: '#f9f9f9' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h2 style={{ textAlign: 'center' }}>Register a Vehicle</h2>

                <input type="text" placeholder="License Number" required value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} style={{ padding: '8px' }} />
                <input type="text" placeholder="Owner Name" required value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} style={{ padding: '8px' }} />
                <input type="text" placeholder="Owner Contact" required value={form.ownerContact} onChange={(e) => setForm({ ...form, ownerContact: e.target.value })} style={{ padding: '8px' }} />

                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ padding: '8px' }}>
                    <option>Car</option>
                    <option>Bike</option>
                    <option>Truck</option>
                    <option>Bus</option>
                    <option>Other</option>
                </select>

                <button type="button" onClick={handleLocation} style={{ padding: '8px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>Use Live Location</button>

                <input type="number" step="any" placeholder="Latitude" value={form.location.latitude} onChange={(e) => setForm({ ...form, location: { ...form.location, latitude: parseFloat(e.target.value), manual: true } })} required={!useLiveLocation} style={{ padding: '8px' }} />
                <input type="number" step="any" placeholder="Longitude" value={form.location.longitude} onChange={(e) => setForm({ ...form, location: { ...form.location, longitude: parseFloat(e.target.value), manual: true } })} required={!useLiveLocation} style={{ padding: '8px' }} />

                <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}>🚗 Register Vehicle</button>
            </form>
        </div>
    );
}
