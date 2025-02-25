import React from 'react';
import { Table, Badge } from 'react-bootstrap';
import { format } from 'date-fns';

const LogEntriesTable = ({ logEntries }) => {
    const getActivityColor = (type) => {
        const colors = {
            'DRIVING': 'primary',
            'ON_DUTY': 'info',
            'OFF_DUTY': 'secondary',
            'SLEEPER': 'warning'
        };
        return colors[type] || 'light';
    };

    return (
        <div className="log-entries-table">
            <Table responsive striped hover>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Activity</th>
                        <th>Location</th>
                        <th>Duration</th>
                        <th>Odometer</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {logEntries?.map((entry, index) => {
                        const startTime = new Date(entry.start_time);
                        const endTime = entry.end_time ? new Date(entry.end_time) : new Date();
                        const duration = (endTime - startTime) / (1000 * 60 * 60); // hours

                        return (
                            <tr key={index}>
                                <td>
                                    {format(startTime, 'PPpp')}
                                </td>
                                <td>
                                    <Badge bg={getActivityColor(entry.activity_type)}>
                                        {entry.activity_type}
                                    </Badge>
                                </td>
                                <td>{entry.location}</td>
                                <td>{duration.toFixed(1)} hrs</td>
                                <td>{entry.odometer_reading} km</td>
                                <td>{entry.notes}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};

export default LogEntriesTable;