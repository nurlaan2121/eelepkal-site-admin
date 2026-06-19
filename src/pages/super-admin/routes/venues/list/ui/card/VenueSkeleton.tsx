export const VenueSkeleton = () => {
  return (
    <div className="p-5 border-b border-slate-100 animate-pulse">
      <div className="flex gap-4">
        <div className="w-24 h-24 bg-slate-100 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-3 pt-1">
          <div className="h-5 bg-slate-100 rounded-lg w-3/4" />
          <div className="flex gap-2">
            <div className="h-6 bg-slate-100 rounded-lg w-20" />
            <div className="h-6 bg-slate-100 rounded-lg w-24" />
          </div>
          <div className="h-10 bg-slate-50 rounded-xl w-full mt-4" />
          <div className="h-4 bg-slate-50 rounded-lg w-1/2 mt-2" />
        </div>
      </div>
    </div>
  );
};
