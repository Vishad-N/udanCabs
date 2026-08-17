'use client';

import { Bell, Smartphone, X } from 'lucide-react';

interface DownloadAppComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DownloadAppComingSoonModal({ isOpen, onClose }: DownloadAppComingSoonModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 p-4 backdrop-blur-md animate-in fade-in-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-app-coming-soon-title"
    >
      <div className="relative w-full max-w-md rounded-3xl border border-border/60 bg-card p-6 text-card-foreground shadow-2xl sm:p-7">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close download app popup"
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X size={18} />
        </button>

        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Smartphone size={28} />
        </div>

        <h2 id="download-app-coming-soon-title" className="text-2xl font-black tracking-tight text-foreground">
          App coming soon
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The Udan Cab mobile app is being prepared. Please book rides from the website for now.
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-border/50 bg-secondary/40 px-4 py-3 text-xs font-semibold text-muted-foreground">
          <Bell size={16} className="shrink-0 text-primary" />
          <span>We will announce the launch once Android and iOS downloads are available.</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 h-11 w-full rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
