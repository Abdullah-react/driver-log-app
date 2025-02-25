import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import JourneyDashboard from '../components/Journey/JourneyDashboard';
import LogEntriesTable from '../components/Journey/LogEntriesTable';
import RestStops from '../components/Journey/RestStops';
import TripMap from '../components/Map/TripMap';

const JourneyDetails = () => {
    const { id } = useParams();
    const [journey, setJourney] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJourneyDetails = async () => {
            try {
                setLoading(true);
                // Replace with your actual API call
                const response = await fetch(`/api/journeys/${id}/`);
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
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!journey) return <div>Journey not found</div>;

    return (
        <Container fluid className="py-4">
            <JourneyDashboard journey={journey} />

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
                        </Tab.Content>
                    </Tab.Container>
                </Col>

                <Col md={12} lg={4}>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">Journey Summary</h5>
                        </Card.Header>
                        <Card.Body>
                            {/* Add summary information here */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default JourneyDetails;