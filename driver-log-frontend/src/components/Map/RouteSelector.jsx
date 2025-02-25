import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LocationMarker = ({ position, onPositionSelected }) => {
    const map = useMapEvents({
        click(e) {
            onPositionSelected(e.latlng);
        },
    });

    return position ? (
        <Marker position={position}>
        </Marker>
    ) : null;
};

const RouteSelector = ({ onLocationSelect }) => {
    const [position, setPosition] = useState(null);

    const handlePositionSelected = (latlng) => {
        setPosition(latlng);
        onLocationSelect(latlng);
    };

    return (
        <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            style={{ height: '400px', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker
                position={position}
                onPositionSelected={handlePositionSelected}
            />
        </MapContainer>
    );
};

export default RouteSelector;