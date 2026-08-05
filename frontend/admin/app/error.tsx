"use client";

import { useEffect } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default function GlobalAdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin Panel Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="bg-red-500/10 text-red-500 p-6 rounded-full mb-6 border border-red-500/20">
        <ShieldAlert size={48} />
      </div>
      <h2 className="text-3xl font-black text-white mb-3 text-center tracking-tight">System Error</h2>
      <p className="text-zinc-400 text-center max-w-md mb-8 leading-relaxed">
        An unexpected error occurred within the administrative dashboard.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-500 transition-all shadow-lg shadow-red-900/50"
      >
        <RefreshCw size={18} />
        Reload Dashboard
      </button>
    </div>
  );
}
