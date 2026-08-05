export function RoutePattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`absolute inset-x-0 bottom-0 w-full z-[-1] pointer-events-none text-red-500 opacity-[0.12] ${className}`}
      viewBox="0 0 1400 400"
      aria-hidden="true"
      preserveAspectRatio="none"
      style={{ height: '200px' }}
    >
      <path
        d="M40 290 C280 100, 460 350, 720 190 S1110 80, 1400 210"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="7 12"
      />
      <circle cx="40" cy="290" r="5" fill="currentColor" />
      <circle cx="720" cy="190" r="4" fill="currentColor" />
      <circle cx="1400" cy="210" r="5" fill="currentColor" />
    </svg>
  );
}
