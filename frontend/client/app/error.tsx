"use client";

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Frontend Error Caught:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="bg-destructive/10 text-destructive p-6 rounded-full mb-6">
        <AlertTriangle size={48} />
      </div>
      <h2 className="text-3xl font-extrabold text-foreground mb-3 text-center">Something went wrong</h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        We encountered an unexpected error while loading this page. Our technical team has been notified.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
      >
        <RefreshCw size={18} />
        Try Again
      </button>
    </div>
  );
}
