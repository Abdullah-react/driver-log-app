import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import ValidatedInput from '../Common/ValidatedInput';
import useFormValidation from '../../hooks/useFormValidation';
import { required, email } from '../../utils/validationRules';

const LoginForm = ({ onLogin }) => {
    const [apiError, setApiError] = useState('');

    const validationRules = {
        email: [required, email],
        password: [required]
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
            email: '',
            password: ''
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
            await onLogin(values);
        } catch (error) {
            setApiError(error.message || 'An error occurred during login');
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

            <ValidatedInput
                type="email"
                name="email"
                label="Email"
                value={values.email}
                error={errors.email}
                onChange={handleChange}
                required
            />

            <ValidatedInput
                type="password"
                name="password"
                label="Password"
                value={values.password}
                error={errors.password}
                onChange={handleChange}
                required
            />

            <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-100"
            >
                {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
        </Form>
    );
};

export default LoginForm;