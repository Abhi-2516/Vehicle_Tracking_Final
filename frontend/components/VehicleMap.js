'use client';

import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '12px',
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

export default function VehicleMap({ vehicles }) {
  const [selected, setSelected] = useState(null);

  const firstVehicle = vehicles?.[0];
  const center = firstVehicle?.location
    ? { lat: firstVehicle.location.latitude, lng: firstVehicle.location.longitude }
    : defaultCenter;

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={5}>
        {vehicles?.filter(vehicle => vehicle.location?.latitude && vehicle.location?.longitude).map((vehicle) => (
          <Marker
            key={vehicle._id}
            position={{ lat: vehicle.location.latitude, lng: vehicle.location.longitude }}
            onClick={() => setSelected(vehicle)}
          />
        ))}

        {selected && (
          <InfoWindow
            position={{ lat: selected.location.latitude, lng: selected.location.longitude }}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <strong>{selected.licenseNumber}</strong>
              <br />
              Owner: {selected.ownerName}
              <br />
              Model: {selected.model}
              <br />
              Type: {selected.type}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
