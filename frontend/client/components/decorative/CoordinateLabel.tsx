export function CoordinateLabel({ text, className = "" }: { text: string, className?: string }) {
  return (
    <div 
      aria-hidden="true"
      className={`absolute hidden md:block text-[10px] tracking-[0.2em] uppercase font-mono text-white/20 pointer-events-none z-[-1] ${className}`}
    >
      {text.split('\n').map((line, i) => (
        <span key={i} className="block leading-relaxed">{line}</span>
      ))}
    </div>
  );
}
