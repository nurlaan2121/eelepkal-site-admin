export const VenueSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6 pb-20">
      {/* Hero Skeleton */}
      <div className="aspect-[4/3] sm:aspect-video bg-slate-100 sm:rounded-[32px] overflow-hidden" />

      {/* Thumbnails Skeleton */}
      <div className="flex gap-4 p-4 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-2xl"
          />
        ))}
      </div>

      {/* Info Section Skeleton */}
      <div className="p-6 sm:p-8 bg-white rounded-[24px] shadow-sm space-y-6">
        <div className="h-8 w-64 bg-slate-100 rounded-lg" />
        <div className="space-y-4">
          <div className="h-10 w-full bg-slate-50 rounded-xl" />
          <div className="h-10 w-full bg-slate-50 rounded-xl" />
          <div className="h-10 w-full bg-slate-50 rounded-xl" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6">
        <div className="h-48 bg-white rounded-[24px] shadow-sm" />
        <div className="h-64 bg-white rounded-[24px] shadow-sm" />
        <div className="h-40 bg-slate-900/5 rounded-[24px]" />
      </div>
    </div>
  );
};
