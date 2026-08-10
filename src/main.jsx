import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Ella Creations ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFF6EE',
          color: '#333333',
          fontFamily: 'Montserrat, sans-serif',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '500px',
            backgroundColor: '#ffffff',
            border: '1px solid rgba(207, 164, 92, 0.4)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
          }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>
              Ella Creations Storefront Notice
            </h1>
            <p style={{ fontSize: '13px', color: '#666666', marginBottom: '20px', lineHeight: '1.6' }}>
              We encountered a minor display issue loading session data. Click below to reload the storefront safely.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#D49AA5',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                letterSpacing: '0.5px'
              }}
            >
              Reset Session & Reload Website
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
