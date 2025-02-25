import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import ValidatedInput from '../Common/ValidatedInput';
import useFormValidation from '../../hooks/useFormValidation';
import { required, numeric } from '../../utils/validationRules';

const JourneyForm = ({ onSubmit }) => {
    const [apiError, setApiError] = useState('');

    const validationRules = {
        startLocation: [required],
        endLocation: [required],
        startTime: [required],
        expectedDuration: [required, numeric],
        vehicleId: [required]
    };

    const {
        values,
        errors,
        isSubmitting,
        setIsSubmitting,
        handleChange,
        validateForm
    } = useFormValidation(
        {
            startLocation: '',
            endLocation: '',
            startTime: '',
            expectedDuration: '',
            vehicleId: '',
            notes: ''
        },
        validationRules
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(values);
        } catch (error) {
            setApiError(error.message || 'Failed to create journey');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {apiError && (
                <Alert variant="danger" onClose={() => setApiError('')} dismissible>
                    {apiError}
                </Alert>
            )}

            <Row>
                <Col md={6}>
                    <ValidatedInput
                        name="startLocation"
                        label="Start Location"
                        value={values.startLocation}
                        error={errors.startLocation}
                        onChange={handleChange}
                        required
                    />
                </Col>
                <Col md={6}>
                    <ValidatedInput
                        name="endLocation"
                        label="End Location"
                        value={values.endLocation}
                        error={errors.endLocation}
                        onChange={handleChange}
                        required
                    />
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <ValidatedInput
                        type="datetime-local"
                        name="startTime"
                        label="Start Time"
                        value={values.startTime}
                        error={errors.startTime}
                        onChange={handleChange}
                        required
                    />
                </Col>
                <Col md={6}>
                    <ValidatedInput
                        type="number"
                        name="expectedDuration"
                        label="Expected Duration (hours)"
                        value={values.expectedDuration}
                        error={errors.expectedDuration}
                        onChange={handleChange}
                        required
                    />
                </Col>
            </Row>

            <ValidatedInput
                name="notes"
                label="Notes"
                value={values.notes}
                error={errors.notes}
                onChange={handleChange}
                as="textarea"
                rows={3}
            />

            <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="mt-3"
            >
                {isSubmitting ? 'Creating Journey...' : 'Create Journey'}
            </Button>
        </Form>
    );
};

export default JourneyForm;