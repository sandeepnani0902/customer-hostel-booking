import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5 pt-5">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <div className="card shadow-sm">
                <div className="card-body p-5">
                  <i className="bi bi-exclamation-triangle display-1 text-warning mb-3"></i>
                  <h3 className="mb-3">Something went wrong</h3>
                  <p className="text-muted mb-4">
                    We're sorry, but something unexpected happened. Please try refreshing the page.
                  </p>
                  <button 
                    className="btn btn-primary me-2"
                  onClick={() => window.location.reload()}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Refresh Page
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                  onClick={() => window.history.back()}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary