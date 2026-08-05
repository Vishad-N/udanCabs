export function MapContourPattern() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full z-[-1] pointer-events-none opacity-[0.03]"
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
    >
      <path d="M-100,200 Q150,150 250,300 T600,200 T1100,400" fill="none" stroke="white" strokeWidth="1" />
      <path d="M-50,250 Q100,100 200,250 T550,250 T1050,450" fill="none" stroke="white" strokeWidth="1" />
      <path d="M-100,350 Q200,350 300,500 T700,400 T1100,600" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 6" />
      <path d="M300,0 Q350,150 250,300" fill="none" stroke="white" strokeWidth="1" />
      <path d="M600,600 Q550,400 700,400" fill="none" stroke="white" strokeWidth="1" />
    </svg>
  );
}
