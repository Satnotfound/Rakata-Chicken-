import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Application ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFFFFF] text-[#000000] flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl border border-black/15 bg-black/[0.02] p-6 text-center space-y-4">
            <h1 className="font-display text-xl font-bold text-[#8A1C05]">
              Terjadi Kendala Sementara
            </h1>
            <p className="text-sm text-[#000000]/80 leading-relaxed">
              Halaman mengalami gangguan tak terduga. Silakan muat ulang halaman
              untuk melanjutkan.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#E3BD32] hover:brightness-95 text-[#000000] font-bold text-sm transition-all cursor-pointer"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
