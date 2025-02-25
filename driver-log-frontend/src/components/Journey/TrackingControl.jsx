import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';

const TrackingControl = ({ onStartTracking, onStopTracking, isTracking }) => {
    const [error, setError] = useState(null);

    const handleStartTracking = async () => {
        try {
            if (!('geolocation' in navigator)) {
                throw new Error('Geolocation is not supported by your browser');
            }
            
            // Request permission for location tracking
            const permission = await navigator.permissions.query({ name: 'geolocation' });
            if (permission.state === 'denied') {
                throw new Error('Location permission denied');
            }

            onStartTracking();
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Card className="mb-4">
            <Card.Body>
                <Card.Title>Tracking Control</Card.Title>
                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}
                <Button
                    variant={isTracking ? 'danger' : 'primary'}
                    onClick={isTracking ? onStopTracking : handleStartTracking}
                >
                    {isTracking ? 'Stop Tracking' : 'Start Tracking'}
                </Button>
            </Card.Body>
        </Card>
    );
};

export default TrackingControl;