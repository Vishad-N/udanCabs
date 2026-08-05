export function TempleArch({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute hidden lg:block w-[480px] h-[650px] pointer-events-none z-[-1] rounded-[240px_240px_24px_24px] ${className}`}
      style={{
        border: '1px solid rgba(229, 165, 66, 0.08)'
      }}
    >
      <div 
        className="absolute inset-[28px] rounded-[inherit]"
        style={{ border: '1px solid rgba(255, 255, 255, 0.035)' }}
      />
      <div 
        className="absolute inset-[58px] rounded-[inherit]"
        style={{ border: '1px solid rgba(255, 255, 255, 0.035)' }}
      />
    </div>
  );
}
