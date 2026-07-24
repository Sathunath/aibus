import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl max-w-lg w-full space-y-4">
            <h1 className="text-lg font-bold text-rose-400">Application Runtime Exception</h1>
            <p className="text-xs text-slate-300">
              A runtime component exception occurred.
            </p>
            <pre className="p-3 bg-slate-950 rounded-xl text-[11px] font-mono text-rose-300 text-left overflow-x-auto max-h-40 border border-slate-800">
              {this.state.error?.message || 'Unknown Error'}
            </pre>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
