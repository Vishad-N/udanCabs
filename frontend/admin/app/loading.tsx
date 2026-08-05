export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-800 border-t-red-600" />
        <span className="text-sm font-bold text-zinc-400 tracking-widest uppercase animate-pulse">Loading Workspace</span>
      </div>
    </div>
  );
}
