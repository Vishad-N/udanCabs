export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/30 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute inset-0"></div>
      </div>
      <h2 className="text-xl font-bold text-foreground mt-6 animate-pulse">Loading experience...</h2>
    </div>
  );
}
