import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import RouteSelector from '../Map/RouteSelector';

const JourneyPlanner = ({ onSubmit }) => {
    const [journey, setJourney] = useState({
        start_location: null,
        end_location: null,
        start_time: '',
        planned_stops: []
    });

    const [currentStep, setCurrentStep] = useState('start'); // 'start' or 'end'

    const handleLocationSelect = (latlng) => {
        if (currentStep === 'start') {
            setJourney(prev => ({
                ...prev,
                start_location: {
                    latitude: latlng.lat,
                    longitude: latlng.lng
                }
            }));
            setCurrentStep('end');
        } else {
            setJourney(prev => ({
                ...prev,
                end_location: {
                    latitude: latlng.lat,
                    longitude: latlng.lng
                }
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(journey);
    };

    return (
        <Card className="shadow-sm mb-4">
            <Card.Body>
                <Card.Title>Plan New Journey</Card.Title>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={12}>
                            <p>Click on the map to select {currentStep} location</p>
                            <RouteSelector onLocationSelect={handleLocationSelect} />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Start Time</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={journey.start_time}
                                    onChange={(e) => setJourney(prev => ({
                                        ...prev,
                                        start_time: e.target.value
                                    }))}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button 
                        variant="primary" 
                        type="submit"
                        disabled={!journey.start_location || !journey.end_location || !journey.start_time}
                    >
                        Create Journey
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default JourneyPlanner;