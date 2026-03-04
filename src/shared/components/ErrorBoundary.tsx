import { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/shared/ui/Card';
import { de } from '@/i18n/locales/de';
import { en } from '@/i18n/locales/en';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

const getLanguage = () => {
  const stored = localStorage.getItem('app-language');
  if (stored === 'de' || stored === 'en') {
    return stored;
  }

  return navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en';
};

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
      const lang = getLanguage();
      const copy = lang === 'de' ? de : en;

      return (
        <div className="min-h-screen bg-ink-50 p-8">
          <Card className="mx-auto max-w-lg text-center">
            <h1 className="text-xl font-semibold text-ink-900">{copy['error.title']}</h1>
            <p className="mt-2 text-sm text-ink-600">{copy['error.message']}</p>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
