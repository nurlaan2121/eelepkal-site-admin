import { apiClient } from "@/shared/api";
import { VenueCondition } from "../types/venue.types";

export const createVenueConditionsApi = () => {
  return {
    updateVenueCondition: async (condition: VenueCondition): Promise<void> => {
      await apiClient.put(
        "/api/super-admin-venue/add-or-update-venue-condition",
        condition,
      );
    },

    getVenueConditions: async (
      venueId: number,
    ): Promise<{
      cancellationDeadline: number[];
      editingDeadline: number[];
      cancellationAllowed: boolean;
      editingAllowed: boolean;
      withADeposit: boolean;
      deposit: number;
    }> => {
      const response = await apiClient.get(
        `/api/guest-conditions/get/${venueId}`,
      );
      return response.data;
    },
  };
};
