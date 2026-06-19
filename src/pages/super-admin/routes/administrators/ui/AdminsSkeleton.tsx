// ─── Skeleton ───
export const AdminsSkeleton = () => (
  <div className="p-4 animate-pulse">
    <div className="flex gap-3">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex-shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-4 bg-slate-100 rounded-lg w-2/3" />
        <div className="h-3 bg-slate-50 rounded-lg w-1/4" />
      </div>
    </div>
    <div className="mt-3 space-y-2">
      <div className="h-9 bg-slate-50 rounded-xl" />
      <div className="h-9 bg-slate-50 rounded-xl" />
    </div>
  </div>
);
