"use client";

import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Don't update state, just suppress the error
        return { hasError: false };
    }

    componentDidCatch(error, errorInfo) {
        // Silently catch the error - don't log or display it
        // The error is already being handled by the component's try-catch
    }

    render() {
        return this.props.children;
    }
}

export default ErrorBoundary;

