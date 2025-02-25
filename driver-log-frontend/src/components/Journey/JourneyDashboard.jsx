import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Table } from 'react-bootstrap';
import { format } from 'date-fns';

const JourneyDashboard = ({ journey }) => {
    const [totalDriveTime, setTotalDriveTime] = useState(0);
    const [totalDistance, setTotalDistance] = useState(0);

    useEffect(() => {
        if (journey?.log_entries) {
            const driveTime = journey.log_entries
                .filter(entry => entry.activity_type === 'DRIVING')
                .reduce((total, entry) => {
                    const start = new Date(entry.start_time);
                    const end = new Date(entry.end_time || new Date());
                    return total + (end - start) / (1000 * 60 * 60); // Convert to hours
                }, 0);
            setTotalDriveTime(driveTime);
        }

        if (journey?.total_distance) {
            setTotalDistance(journey.total_distance);
        }
    }, [journey]);

    const getStatusColor = (status) => {
        const colors = {
            'PLANNED': 'primary',
            'IN_PROGRESS': 'warning',
            'COMPLETED': 'success',
            'CANCELLED': 'danger'
        };
        return colors[status] || 'secondary';
    };

    return (
        <div className="journey-dashboard mb-4">
            <Card>
                <Card.Body>
                    <Row>
                        <Col md={8}>
                            <h3>{journey?.start_location} → {journey?.end_location}</h3>
                            <p className="text-muted">
                                Started: {format(new Date(journey?.start_time), 'PPpp')}
                            </p>
                        </Col>
                        <Col md={4} className="text-end">
                            <Badge bg={getStatusColor(journey?.status)}>
                                {journey?.status}
                            </Badge>
                        </Col>
                    </Row>

                    <Row className="mt-4">
                        <Col md={3}>
                            <Card className="text-center h-100">
                                <Card.Body>
                                    <h6>Total Distance</h6>
                                    <h3>{totalDistance.toFixed(1)} km</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="text-center h-100">
                                <Card.Body>
                                    <h6>Drive Time</h6>
                                    <h3>{totalDriveTime.toFixed(1)} hrs</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="text-center h-100">
                                <Card.Body>
                                    <h6>Rest Stops</h6>
                                    <h3>{journey?.rest_stops?.length || 0}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="text-center h-100">
                                <Card.Body>
                                    <h6>Log Entries</h6>
                                    <h3>{journey?.log_entries?.length || 0}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

export default JourneyDashboard;