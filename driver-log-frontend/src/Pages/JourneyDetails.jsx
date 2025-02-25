import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Tab, Nav, Card, Badge } from 'react-bootstrap';
import JourneyDashboard from '../components/Journey/JourneyDashboard';
import LogEntriesTable from '../components/Journey/LogEntriesTable';
import RestStops from '../components/Journey/RestStops';
import TripMap from '../components/Map/TripMap';
import LiveTracking from '../components/Journey/LiveTracking';
import TrackingControl from '../components/Journey/TrackingControl';
import { format } from 'date-fns';

const JourneyDetails = () => {
    const { id } = useParams();
    const [journey, setJourney] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isTracking, setIsTracking] = useState(false);
    const [liveStats, setLiveStats] = useState({
        currentSpeed: 0,
        currentLocation: null,
        elapsedTime: 0,
        distanceCovered: 0,
        lastUpdate: null
    });
    useEffect(() => {
        const fetchJourneyDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/journeys/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch journey details');
                }
                const data = await response.json();
                setJourney(data);
            } catch (err) {
                setError('Failed to load journey details');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchJourneyDetails();
        
        // Set up real-time updates
        const ws = new WebSocket(`ws://${window.location.host}/ws/journey/${id}/`);
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'journey_update') {
                setJourney(prevJourney => ({
                    ...prevJourney,
                    ...data.journey
                }));
            } else if (data.type === 'live_stats') {
                setLiveStats(data.stats);
            }
        };

        return () => {
            ws.close();
        };
    }, [id]);

    const handleStartTracking = () => {
        setIsTracking(true);
    };

    const handleStopTracking = () => {
        setIsTracking(false);
    };

    const calculateStats = () => {
        if (!journey) return {};

        const totalDistance = journey.total_distance || 0;
        const startTime = new Date(journey.start_time);
        const endTime = journey.end_time ? new Date(journey.end_time) : new Date();
        const duration = (endTime - startTime) / (1000 * 60 * 60); // in hours
        const averageSpeed = totalDistance / duration;

        return {
            totalDistance,
            duration,
            averageSpeed,
            restStopsCount: journey.rest_stops?.length || 0,
            logEntriesCount: journey.log_entries?.length || 0
        };
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!journey) return <div>Journey not found</div>;

    const stats = calculateStats();

    return (
        <Container fluid className="py-4">
            <JourneyDashboard journey={journey} />

            {journey.status === 'IN_PROGRESS' && (
                <Row className="mb-4">
                    <Col>
                        <TrackingControl
                            isTracking={isTracking}
                            onStartTracking={handleStartTracking}
                            onStopTracking={handleStopTracking}
                        />
                    </Col>
                </Row>
            )}

            <Row>
                <Col md={12} lg={8}>
                    <Tab.Container defaultActiveKey="logs">
                        <Nav variant="tabs" className="mb-3">
                            <Nav.Item>
                                <Nav.Link eventKey="logs">Log Entries</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="stops">Rest Stops</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="map">Route Map</Nav.Link>
                            </Nav.Item>
                            {isTracking && (
                                <Nav.Item>
                                    <Nav.Link eventKey="live">Live Tracking</Nav.Link>
                                </Nav.Item>
                            )}
                        </Nav>

                        <Tab.Content>
                            <Tab.Pane eventKey="logs">
                                <LogEntriesTable logEntries={journey.log_entries} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="stops">
                                <RestStops stops={journey.rest_stops} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="map">
                                <div style={{ height: '600px' }}>
                                    <TripMap
                                        center={[
                                            journey.start_location.latitude,
                                            journey.start_location.longitude
                                        ]}
                                        route={journey.route_data}
                                        stops={journey.rest_stops}
                                        zoom={12}
                                    />
                                </div>
                            </Tab.Pane>
                            {isTracking && (
                                <Tab.Pane eventKey="live">
                                    <div style={{ height: '600px' }}>
                                        <LiveTracking journeyId={journey.id} />
                                    </div>
                                </Tab.Pane>
                            )}
                        </Tab.Content>
                    </Tab.Container>
                </Col>

                <Col md={12} lg={4}>
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">Journey Summary</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-3">
                                <Badge bg={journey.status === 'COMPLETED' ? 'success' : 'warning'}>
                                    {journey.status}
                                </Badge>
                            </div>
                            <dl className="row">
                                <dt className="col-sm-6">Start Time</dt>
                                <dd className="col-sm-6">
                                    {format(new Date(journey.start_time), 'PPpp')}
                                </dd>

                                <dt className="col-sm-6">Duration</dt>
                                <dd className="col-sm-6">
                                    {stats.duration.toFixed(1)} hours
                                </dd>

                                <dt className="col-sm-6">Total Distance</dt>
                                <dd className="col-sm-6">
                                    {stats.totalDistance.toFixed(1)} km
                                </dd>

                                <dt className="col-sm-6">Average Speed</dt>
                                <dd className="col-sm-6">
                                    {stats.averageSpeed.toFixed(1)} km/h
                                </dd>

                                <dt className="col-sm-6">Rest Stops</dt>
                                <dd className="col-sm-6">{stats.restStopsCount}</dd>

                                <dt className="col-sm-6">Log Entries</dt>
                                <dd className="col-sm-6">{stats.logEntriesCount}</dd>

                                {journey.end_time && (
                                    <>
                                        <dt className="col-sm-6">End Time</dt>
                                        <dd className="col-sm-6">
                                            {format(new Date(journey.end_time), 'PPpp')}
                                        </dd>
                                    </>
                                )}
                            </dl>
                        </Card.Body>
                    </Card>

                    {journey.status === 'IN_PROGRESS' && isTracking && (
                        <Card>
                            <Card.Header>
                                <h5 className="mb-0">Live Statistics</h5>
                            </Card.Header>
                            <Card.Body>
                                <dl className="row mb-0">
                                    <dt className="col-sm-6">Current Speed</dt>
                                    <dd className="col-sm-6">
                                        {liveStats.currentSpeed.toFixed(1)} km/h
                                    </dd>

                                    <dt className="col-sm-6">Distance Covered</dt>
                                    <dd className="col-sm-6">
                                        {liveStats.distanceCovered.toFixed(1)} km
                                    </dd>

                                    <dt className="col-sm-6">Elapsed Time</dt>
                                    <dd className="col-sm-6">
                                        {Math.floor(liveStats.elapsedTime / 60)}h {liveStats.elapsedTime % 60}m
                                    </dd>

                                    <dt className="col-sm-6">Current Location</dt>
                                    <dd className="col-sm-6">
                                        {liveStats.currentLocation ? (
                                            <>
                                                {liveStats.currentLocation.latitude.toFixed(6)}, 
                                                {liveStats.currentLocation.longitude.toFixed(6)}
                                            </>
                                        ) : (
                                            'Updating...'
                                        )}
                                    </dd>

                                    <dt className="col-sm-6">Last Update</dt>
                                    <dd className="col-sm-6">
                                        {liveStats.lastUpdate ? (
                                            format(new Date(liveStats.lastUpdate), 'HH:mm:ss')
                                        ) : (
                                            'Not yet updated'
                                        )}
                                    </dd>
                                </dl>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default JourneyDetails;