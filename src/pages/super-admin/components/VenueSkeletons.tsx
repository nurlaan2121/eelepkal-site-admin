import React from 'react';

export const VenueSkeleton: React.FC = () => {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="h-16 bg-slate-100 rounded-2xl mb-6" />

            {/* Hero Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px]">
                <div className="md:col-span-3 bg-slate-200 rounded-[2rem]" />
                <div className="hidden md:flex flex-col gap-4">
                    <div className="flex-1 bg-slate-200 rounded-3xl" />
                    <div className="flex-1 bg-slate-200 rounded-3xl" />
                    <div className="flex-1 bg-slate-200 rounded-3xl" />
                </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="h-48 bg-slate-100 rounded-[2rem]" />
                    <div className="h-64 bg-slate-100 rounded-[2rem]" />
                    <div className="h-56 bg-slate-100 rounded-[2rem]" />
                </div>
                <div className="space-y-6">
                    <div className="h-72 bg-slate-100 rounded-[2rem]" />
                    <div className="h-64 bg-slate-100 rounded-[2rem]" />
                    <div className="h-48 bg-slate-900/10 rounded-[2rem]" />
                </div>
            </div>
        </div>
    );
};
