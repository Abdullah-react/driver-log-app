import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { calculateRoute } from './routeService';

function RouteMap() {
  const [route, setRoute] = useState(null);

  const handleCalculateRoute = async () => {
    const start = [32.8597, 39.9334]; // Ankara
    const end = [29.0207, 41.0082];   // İstanbul
    
    const routeData = await calculateRoute(start, end);
    if (routeData) {
      // Rota koordinatlarını al
      const coordinates = routeData.routes[0].geometry.coordinates;
      setRoute(coordinates);
    }
  };

  return (
    <div>
      <button onClick={handleCalculateRoute}>Rota Hesapla</button>
      <MapContainer center={[39.9334, 32.8597]} zoom={6} style={{ height: '400px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='OpenStreetMap contributors'
        />
        {route && (
          <Polyline 
            positions={route.map(coord => [coord[1], coord[0]])} 
            color="blue" 
          />
        )}
      </MapContainer>
    </div>
  );
}

export default RouteMap;
