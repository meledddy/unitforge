export default function AppLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      className="space-y-5 sm:space-y-6"
    >
      <div className="border-border/60 bg-card/70 h-[15.5rem] animate-pulse rounded-[1.8rem] border motion-reduce:animate-none sm:h-[13.5rem]" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <LoadingBlock />
        <LoadingBlock />
        <LoadingBlock className="col-span-2 sm:col-span-1" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <div className="border-border/60 bg-card/70 h-80 animate-pulse rounded-[1.65rem] border motion-reduce:animate-none" />
        <div className="border-border/60 bg-card/70 h-80 animate-pulse rounded-[1.65rem] border motion-reduce:animate-none" />
      </div>
      <span className="sr-only">Loading dashboard</span>
    </div>
  );
}

function LoadingBlock({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`border-border/60 bg-card/70 h-28 animate-pulse rounded-[1.35rem] border motion-reduce:animate-none sm:h-32 ${className}`}
    />
  );
}
