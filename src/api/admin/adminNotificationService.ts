import { apiClient } from '../client';

export interface AdminNotification {
    notificationId: number;
    title: string;
    description: string;
    notificationType: string;
    createdAt: string;
}

export interface NotificationParams {
    date: string;
    offset?: number;
    limit?: number;
}

export const adminNotificationService = {
    getNotifications: async (params: NotificationParams): Promise<AdminNotification[]> => {
        const { date, offset = 0, limit = 50 } = params;
        const response = await apiClient.get<AdminNotification[]>('/api/admin-notification/get-notifications', {
            params: {
                date,
                offset,
                limit,
            },
        });
        return response.data;
    },
};
