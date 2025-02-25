export const required = (value) => {
    if (!value || value.trim() === '') {
        return 'This field is required';
    }
    return '';
};

export const email = (value) => {
    if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
        return 'Invalid email address';
    }
    return '';
};

export const minLength = (min) => (value) => {
    if (value && value.length < min) {
        return `Must be at least ${min} characters`;
    }
    return '';
};

export const maxLength = (max) => (value) => {
    if (value && value.length > max) {
        return `Must be less than ${max} characters`;
    }
    return '';
};

export const numeric = (value) => {
    if (value && !/^\d+$/.test(value)) {
        return 'Must be a number';
    }
    return '';
};

export const phone = (value) => {
    if (value && !/^\+?[\d\s-]{10,}$/.test(value)) {
        return 'Invalid phone number';
    }
    return '';
};

export const password = (value) => {
    if (value && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)) {
        return 'Password must be at least 8 characters and contain both letters and numbers';
    }
    return '';
};