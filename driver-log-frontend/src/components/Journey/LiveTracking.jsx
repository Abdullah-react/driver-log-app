import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LiveLocationMarker = ({ position }) => {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.setView(position);
        }
    }, [position, map]);

    return position ? (
        <Marker position={position}>
            <Popup>Current Location</Popup>
        </Marker>
    ) : null;
};

const LiveTracking = ({ journeyId }) => {
    const [position, setPosition] = useState(null);
    const [status, setStatus] = useState('connecting');
    const wsRef = useRef(null);

    useEffect(() => {
        // Initialize WebSocket connection
        const ws = new WebSocket(`ws://${window.location.host}/ws/journey/${journeyId}/`);
        wsRef.current = ws;

        ws.onopen = () => {
            setStatus('connected');
            // Start sending location updates if geolocation is available
            if ('geolocation' in navigator) {
                const watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setPosition([latitude, longitude]);
                        
                        // Send location update through WebSocket
                        ws.send(JSON.stringify({
                            type: 'location_update',
                            latitude,
                            longitude,
                            timestamp: new Date().toISOString()
                        }));
                    },
                    (error) => console.error('Geolocation error:', error),
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    }
                );

                return () => {
                    navigator.geolocation.clearWatch(watchId);
                };
            }
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // Handle incoming updates
            if (data.type === 'journey_update') {
                // Update journey status, etc.
            }
        };

        ws.onclose = () => {
            setStatus('disconnected');
        };

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [journeyId]);

    return (
        <div className="live-tracking">
            <div className="connection-status">
                Status: {status}
            </div>
            <MapContainer
                center={position || [51.505, -0.09]}
                zoom={13}
                style={{ height: '400px', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LiveLocationMarker position={position} />
            </MapContainer>
        </div>
    );
};

export default LiveTracking;