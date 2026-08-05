export function AmbientGlow({ variant, className = "" }: { variant: 'red' | 'saffron', className?: string }) {
  const bg = variant === 'red' 
    ? 'radial-gradient(circle, rgba(239, 47, 61, 0.08), transparent 68%)'
    : 'radial-gradient(circle, rgba(229, 165, 66, 0.055), transparent 68%)';
    
  return (
    <div
      aria-hidden="true"
      className={`absolute w-[560px] h-[560px] rounded-full blur-[20px] pointer-events-none z-[-2] ${className}`}
      style={{ background: bg }}
    />
  );
}
