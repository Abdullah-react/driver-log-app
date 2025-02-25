import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import { format } from 'date-fns';

const RestStops = ({ stops }) => {
    return (
        <Card className="mb-4">
            <Card.Header>
                <h5 className="mb-0">Rest Stops</h5>
            </Card.Header>
            <ListGroup variant="flush">
                {stops?.map((stop, index) => {
                    const planned = new Date(stop.planned_arrival);
                    const actual = stop.actual_arrival ? new Date(stop.actual_arrival) : null;
                    const diff = actual ? (actual - planned) / (1000 * 60) : 0; // minutes

                    return (
                        <ListGroup.Item key={index}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6>{stop.location}</h6>
                                    <small className="text-muted">
                                        Planned: {format(planned, 'PPpp')}
                                    </small>
                                    {actual && (
                                        <div>
                                            <small className="text-muted">
                                                Actual: {format(actual, 'PPpp')}
                                            </small>
                                        </div>
                                    )}
                                </div>
                                <div className="text-end">
                                    <Badge bg={diff > 15 ? 'danger' : 'success'}>
                                        {actual ? `${Math.abs(diff)} min ${diff > 0 ? 'late' : 'early'}` : 'Pending'}
                                    </Badge>
                                </div>
                            </div>
                        </ListGroup.Item>
                    );
                })}
            </ListGroup>
        </Card>
    );
};

export default RestStops;   