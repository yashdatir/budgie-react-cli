'use strict';

// ─── src/components/ErrorBoundary.tsx ─────────────────────────────────────────
function makeErrorBoundary() {
  return `import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Rendered when an error is caught. Receives the error + a reset callback. */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** Called after an error is caught — useful for error reporting (e.g. Sentry). */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — wraps children and catches unhandled render errors.
 *
 * @example
 * <ErrorBoundary fallback={<ErrorFallback />} onError={(e) => logToSentry(e)}>
 *   <SomeComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      if (typeof fallback === 'function') {
        return fallback(error, this.handleReset);
      }
      return fallback ?? null;
    }

    return children;
  }
}

export default ErrorBoundary;
`;
}

// ─── src/components/ErrorFallback.tsx ─────────────────────────────────────────
function makeErrorFallback() {
  return `import React from 'react';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

/**
 * Default error fallback UI — replace or extend as needed.
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => (
  <div className="error-fallback" role="alert">
    <h2>⚠️ Something went wrong</h2>
    {error && (
      <pre
        style={{
          background: '#1e293b',
          padding: '1rem',
          borderRadius: 8,
          maxWidth: 600,
          overflowX: 'auto',
          fontSize: '0.85rem',
          color: '#f87171',
        }}
      >
        {error.message}
      </pre>
    )}
    {resetError && (
      <button type="button" onClick={resetError}>
        Try again
      </button>
    )}
  </div>
);

export default ErrorFallback;
`;
}

module.exports = { makeErrorBoundary, makeErrorFallback };
