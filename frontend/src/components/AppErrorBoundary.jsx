import React from 'react';

export class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="runtime-error">
          <section>
            <h1>Something went wrong</h1>
            <p>{this.state.error.message}</p>
            <button
              className="primary-button"
              onClick={() => {
                localStorage.removeItem('team-task-manager-auth');
                window.location.href = '/login';
              }}
            >
              Reset session
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
