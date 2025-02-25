import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const LogEntryForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    activity_type: 'DRIVING',
    start_time: '',
    location: '',
    odometer_reading: '',
    notes: '',
  });

  const activityTypes = [
    { value: 'DRIVING', label: 'Driving' },
    { value: 'ON_DUTY', label: 'On Duty Not Driving' },
    { value: 'OFF_DUTY', label: 'Off Duty' },
    { value: 'SLEEPER', label: 'Sleeper Berth' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Log Entry</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Activity Type</Form.Label>
            <Form.Select
              name="activity_type"
              value={formData.activity_type}
              onChange={handleChange}
              required
            >
              {activityTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="datetime-local"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Odometer Reading</Form.Label>
            <Form.Control
              type="number"
              name="odometer_reading"
              value={formData.odometer_reading}
              onChange={handleChange}
              required
              min="0"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Add Log Entry
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default LogEntryForm;