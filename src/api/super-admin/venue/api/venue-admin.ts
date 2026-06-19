import {apiClient} from "@/shared/api";
import {AdminForReplace} from "../types/venue.types";

export const createVenueAdminApi = () => {
  return {
    getAdminsForReplace: async (): Promise<AdminForReplace[]> => {
      const response = await apiClient.get<AdminForReplace[]>(
        "/api/super-admin/get-admins-for-replace",
      );
      return response.data;
    },
    replaceAdmin: async (
      venueId: number,
      newAdminId: number,
    ): Promise<void> => {
      await apiClient.post(
        `/api/super-admin/replace-admin/${venueId}/${newAdminId}`,
      );
    },
  };
};
