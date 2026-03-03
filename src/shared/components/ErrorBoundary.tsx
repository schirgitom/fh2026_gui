import { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/shared/ui/Card';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ink-50 p-8">
          <Card className="mx-auto max-w-lg text-center">
            <h1 className="text-xl font-semibold text-ink-900">Something went wrong</h1>
            <p className="mt-2 text-sm text-ink-600">
              Please refresh the page or contact support if the issue persists.
            </p>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
