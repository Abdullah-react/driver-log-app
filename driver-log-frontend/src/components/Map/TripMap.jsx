import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const TripMap = ({ route, stops, center, zoom = 13 }) => {
    return (
        <MapContainer
            center={center || [51.505, -0.09]}
            zoom={zoom}
            style={{ height: '500px', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Draw route line if route exists */}
            {route && route.length > 0 && (
                <Polyline
                    positions={route}
                    color="blue"
                    weight={3}
                    opacity={0.7}
                />
            )}

            {/* Show markers for stops */}
            {stops && stops.map((stop, index) => (
                <Marker
                    key={index}
                    position={[stop.latitude, stop.longitude]}
                >
                    <Popup>
                        <div>
                            <h4>Stop {index + 1}</h4>
                            <p>Location: {stop.location}</p>
                            <p>Planned Arrival: {new Date(stop.planned_arrival).toLocaleString()}</p>
                            {stop.actual_arrival && (
                                <p>Actual Arrival: {new Date(stop.actual_arrival).toLocaleString()}</p>
                            )}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default TripMap;