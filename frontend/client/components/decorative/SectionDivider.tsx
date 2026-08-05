export function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full flex justify-center py-4 ${className}`} aria-hidden="true">
      <div 
        className="h-[1px]"
        style={{
          width: 'min(1320px, calc(100% - 48px))',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), rgba(239, 47, 61, 0.22), rgba(255, 255, 255, 0.08), transparent)'
        }}
      >
        <div className="mx-auto w-1.5 h-1.5 rounded-full bg-red-500/40 -translate-y-1/2" />
      </div>
    </div>
  );
}
