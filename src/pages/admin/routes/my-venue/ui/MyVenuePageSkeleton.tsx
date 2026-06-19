export const MyVenuePageSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Hero skeleton */}
    <div className="h-64 bg-slate-100 rounded-3xl" />

    {/* Info cards skeleton */}
    <div className="grid grid-cols-2 gap-4">
      {Array.from({length: 4}).map((_, i) => (
        <div key={i} className="h-24 bg-slate-100 rounded-2xl" />
      ))}
    </div>

    {/* Details skeleton */}
    <div className="space-y-4">
      {Array.from({length: 3}).map((_, i) => (
        <div key={i} className="h-32 bg-slate-100 rounded-2xl" />
      ))}
    </div>
  </div>
);
