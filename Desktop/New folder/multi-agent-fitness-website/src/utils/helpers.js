// This file contains utility functions used throughout the application.

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
}

function calculateBMI(weight, height) {
    if (height <= 0) return null;
    return (weight / (height * height)).toFixed(2);
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

export { formatDate, calculateBMI, isEmpty, debounce };