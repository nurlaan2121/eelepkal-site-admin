import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalyticsCardProps {
    title: string;
    value: string | number;
    change?: string;
    isPositive?: boolean;
    icon: LucideIcon;
    color: 'brand' | 'blue' | 'amber' | 'purple';
}

const colorMap = {
    brand: 'bg-brand-50 text-brand-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
};

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
    title,
    value,
    change,
    isPositive,
    icon: Icon,
    color,
}) => {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${colorMap[color]}`}>
                    <Icon size={24} />
                </div>
                {change && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-brand-50 text-brand-700' : 'bg-red-50 text-red-700'
                        }`}>
                        {isPositive ? '+' : ''}{change}
                    </span>
                )}
            </div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </motion.div>
    );
};
