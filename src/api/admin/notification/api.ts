import { apiClient } from "@/shared/api";
import { AdminNotification, NotificationParams } from "./types";



export const adminNotificationService = {
  getNotifications: async (
    params: NotificationParams,
  ): Promise<AdminNotification[]> => {
    const {date, offset = 0, limit = 50} = params;
    const response = await apiClient.get<AdminNotification[]>(
      "/api/admin-notification/get-notifications",
      {
        params: {
          date,
          offset,
          limit,
        },
      },
    );
    return response.data;
  },
};
