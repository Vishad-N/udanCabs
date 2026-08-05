export function SectionWatermark({ text, align = "right" }: { text: string; align?: "left" | "right" }) {
  return (
    <div
      aria-hidden="true"
      className="absolute bottom-[-40px] z-[-2] pointer-events-none select-none whitespace-nowrap opacity-[0.025] font-sans font-extrabold leading-[0.8] tracking-[-0.07em]"
      style={{
        [align]: '-20px',
        fontSize: 'clamp(110px, 16vw, 240px)',
      }}
    >
      {text}
    </div>
  );
}
