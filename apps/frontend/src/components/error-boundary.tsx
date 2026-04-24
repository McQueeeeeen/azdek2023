"use client";

import { ReactNode } from "react";
import React from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        this.props.fallback?.(this.state.error, this.resetError) || (
          <div className="w-full h-screen flex items-center justify-center bg-error-container">
            <div className="max-w-md text-center p-8 bg-white rounded-xl shadow-lg">
              <div className="text-4xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-error mb-2">Произошла ошибка</h1>
              <p className="text-ink-variant mb-6">{this.state.error.message}</p>
              <button
                onClick={this.resetError}
                className="px-6 py-2 bg-clay text-white rounded-lg font-semibold hover:bg-clay-container transition-colors"
              >
                Попробовать снова
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
