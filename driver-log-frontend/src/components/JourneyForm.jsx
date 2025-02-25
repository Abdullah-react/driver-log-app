import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

const JourneyForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    start_location: '',
    end_location: '',
    start_time: '',
    planned_stops: [],
  });

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
        <Card.Title>New Journey</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Start Location</Form.Label>
                <Form.Control
                  type="text"
                  name="start_location"
                  value={formData.start_location}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>End Location</Form.Label>
                <Form.Control
                  type="text"
                  name="end_location"
                  value={formData.end_location}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
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
            </Col>
          </Row>
          <Button variant="primary" type="submit">
            Create Journey
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default JourneyForm;