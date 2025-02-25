import { useState, useCallback } from 'react';

const useFormValidation = (initialState, validationRules) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateField = useCallback((name, value) => {
        const rules = validationRules[name];
        if (!rules) return '';

        for (const rule of rules) {
            const error = rule(value, values);
            if (error) return error;
        }
        return '';
    }, [validationRules, values]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
        
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    }, [validateField]);

    const validateForm = useCallback(() => {
        const newErrors = {};
        let isValid = true;

        Object.keys(validationRules).forEach(fieldName => {
            const error = validateField(fieldName, values[fieldName]);
            if (error) {
                newErrors[fieldName] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    }, [validateField, validationRules, values]);

    return {
        values,
        errors,
        isSubmitting,
        setIsSubmitting,
        handleChange,
        validateForm,
        setValues,
        setErrors
    };
};

export default useFormValidation;