import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // Optionally log error
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ color: 'red', padding: 40 }}>Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 