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
