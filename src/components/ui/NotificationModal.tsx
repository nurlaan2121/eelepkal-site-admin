import React, { useState, useEffect } from 'react';
import { X, Bell, Calendar } from 'lucide-react';
import { adminNotificationService, AdminNotification } from '../../api/admin/adminNotificationService';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && selectedDate) {
            fetchNotifications();
        }
    }, [isOpen, selectedDate]);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminNotificationService.getNotifications({
                date: selectedDate,
                offset: 0,
                limit: 50,
            });
            setNotifications(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка загрузки уведомлений');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        } catch {
            return dateString;
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[85vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Bell className="text-brand-primary" size={20} />
                        <h2 className="text-lg font-bold text-gray-900">Уведомления</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Date Picker */}
                <div className="p-4 border-b border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar size={14} className="inline mr-1" />
                        Выберите дату
                    </label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    />
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">
                            <p>{error}</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Bell size={48} className="mx-auto mb-3 opacity-30" />
                            <p className="text-sm">Нет уведомлений за выбранную дату</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.notificationId}
                                    className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-gray-900 text-sm">
                                            {notification.title}
                                        </h3>
                                        <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                            {formatDate(notification.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {notification.description}
                                    </p>
                                    <div className="mt-2">
                                        <span className="inline-block px-2 py-1 bg-brand-100 text-brand-700 text-xs rounded-lg font-medium">
                                            {notification.notificationType}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
