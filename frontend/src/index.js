import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          maxWidth: '800px',
          margin: '100px auto',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <h1 style={{ color: '#dc3545', marginBottom: '20px' }}>⚠️ Something went wrong</h1>
          <p style={{ fontSize: '18px', marginBottom: '30px' }}>
            The application encountered an error. Please check the console for details.
          </p>
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'left',
            marginBottom: '20px'
          }}>
            <h3>Error Details:</h3>
            <pre style={{
              overflow: 'auto',
              fontSize: '14px',
              color: '#dc3545'
            }}>
              {this.state.error && this.state.error.toString()}
            </pre>
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            🔄 Reload Page
          </button>
          <a
            href="/diagnostics.html"
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            🔍 Run Diagnostics
          </a>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
function AppLoader() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #20603D 0%, #00A1DE 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        border: '4px solid rgba(255,255,255,0.3)',
        borderTop: '4px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <h2 style={{ color: 'white', marginTop: '20px' }}>Loading GovConnect...</h2>
      <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '10px' }}>
        If this takes too long, please check the console for errors.
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Log environment info
console.log('🚀 GovConnect Initializing...');
console.log('Environment:', process.env.NODE_ENV);
console.log('API URL:', process.env.REACT_APP_API_URL || 'NOT SET ⚠️');
console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL || 'NOT SET ⚠️');
console.log('React Version:', React.version);

// Show loading screen briefly
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppLoader />);

// Load the actual app after a brief moment (allows seeing loading screen)
setTimeout(() => {
  try {
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
    console.log('✅ App rendered successfully');
  } catch (error) {
    console.error('❌ Failed to render app:', error);
    root.render(
      <div style={{
        padding: '40px',
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <h1 style={{ color: '#dc3545' }}>Failed to load application</h1>
        <p>Check the console for error details.</p>
        <pre style={{ textAlign: 'left', background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
          {error.toString()}
        </pre>
      </div>
    );
  }
}, 500);
