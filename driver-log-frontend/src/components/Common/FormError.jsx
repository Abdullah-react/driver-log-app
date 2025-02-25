import React from 'react';
import { Alert } from 'react-bootstrap';

const FormError = ({ error }) => {
    if (!error) return null;

    return (
        <Alert variant="danger" className="mt-2 mb-2 py-2">
            {error}
        </Alert>
    );
};

export default FormError;