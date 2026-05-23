import React from 'react';

export const VenueSkeleton: React.FC = () => {
    return (
        <div className="space-y-8 animate-pulse max-w-7xl mx-auto pb-20">
            {/* Header Skeleton */}
            <div className="fixed top-0 inset-x-0 h-20 bg-white/80 backdrop-blur-lg border-b border-slate-100 z-50 flex items-center px-8">
                <div className="w-10 h-10 bg-slate-100 rounded-xl mr-4" />
                <div className="space-y-2">
                    <div className="h-6 w-48 bg-slate-100 rounded-lg" />
                    <div className="h-3 w-32 bg-slate-50 rounded-lg" />
                </div>
            </div>

            {/* Gallery Skeleton */}
            <div className="pt-20">
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
                    <div className="md:col-span-2 md:row-span-2 bg-slate-100 rounded-[3rem]" />
                    <div className="bg-slate-50 rounded-[2.5rem]" />
                    <div className="bg-slate-50 rounded-[2.5rem]" />
                    <div className="bg-slate-50 rounded-[2.5rem]" />
                    <div className="bg-slate-50 rounded-[2.5rem]" />
                </div>
            </div>

            {/* Info Bar Skeleton */}
            <div className="h-28 bg-white rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center justify-between px-10">
                <div className="flex gap-10">
                    <div className="w-48 h-12 bg-slate-50 rounded-2xl" />
                    <div className="w-48 h-12 bg-slate-50 rounded-2xl" />
                    <div className="w-48 h-12 bg-slate-50 rounded-2xl" />
                </div>
                <div className="w-40 h-14 bg-slate-100 rounded-2xl" />
            </div>

            {/* Grid Layout Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="h-64 bg-white border border-slate-50 rounded-[2.5rem]" />
                    <div className="h-96 bg-white border border-slate-50 rounded-[2.5rem]" />
                </div>
                <div className="space-y-8">
                    <div className="h-64 bg-white border border-slate-50 rounded-[2.5rem]" />
                    <div className="h-72 bg-slate-900/5 rounded-[2.5rem]" />
                </div>
            </div>
        </div>
    );
};
