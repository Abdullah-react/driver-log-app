import React from 'react';
import { Form } from 'react-bootstrap';
import FormError from './FormError';

const ValidatedInput = ({
    type = 'text',
    name,
    label,
    value,
    error,
    onChange,
    placeholder,
    required = false,
    ...props
}) => {
    return (
        <Form.Group className="mb-3">
            {label && (
                <Form.Label>
                    {label}
                    {required && <span className="text-danger">*</span>}
                </Form.Label>
            )}
            <Form.Control
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                isInvalid={!!error}
                {...props}
            />
            <FormError error={error} />
        </Form.Group>
    );
};

export default ValidatedInput;