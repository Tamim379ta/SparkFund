export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-surface rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xl font-bold text-primary">Spark</span>
          <span className="text-xl font-bold text-text">Fund</span>
        </div>
        <p className="text-muted text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  );
}