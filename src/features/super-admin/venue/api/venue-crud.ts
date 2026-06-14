import {apiClient} from "@/shared/api";
import {
  BasicInfoData,
  VenueAmenitiesData,
  VenueConditionsData,
  VenueContactData,
  VenueCuisinesData,
  VenueDetailsData,
  VenueWorkingHours,
} from "../types/venue.types";

export const createVenueCrudApi = () => {
  return {
    updateNameAndDescription: async (
      venueId: number,
      name: string,
      description: string,
    ): Promise<void> => {
      await apiClient.put(
        `/api/super-admin-venue/update-name-and-description/${venueId}`,
        null,
        {
          params: {name, description},
        },
      );
    },
    deleteVenue: async (id: number): Promise<void> => {
      await apiClient.delete(`/api/super-admin-venue/delete/${id}`);
    },

    deleteFeedback: async (
      venueId: number,
      feedbackId: number,
    ): Promise<void> => {
      await apiClient.delete(
        `/api/super-admin-feedback/delete/${venueId}/${feedbackId}`,
      );
    },

    // ─────────── Venue Image Management ───────────
    deleteVenueImage: async (
      venueId: number,
      imageId: number,
    ): Promise<void> => {
      await apiClient.put(
        `/api/super-admin-venue/delete-image-in-venue/${venueId}/${imageId}`,
      );
    },

    addVenueImage: async (venueId: number, url: string): Promise<void> => {
      await apiClient.put(
        `/api/super-admin-venue/add-image-in-venue/${venueId}`,
        null,
        {
          params: {url},
        },
      );
    },

    // Step 1: Add Basic Info
    addBasicInfo: async (data: BasicInfoData): Promise<{idVenue: number}> => {
      const response = await apiClient.post<{idVenue: number}>(
        "/api/super-admin-venue/add-basic",
        data,
      );
      return response.data;
    },

    // Step 2: Add Venue Details
    addVenueDetails: async (
      venueId: number,
      data: VenueDetailsData,
    ): Promise<void> => {
      await apiClient.put(`/api/super-admin-venue/add-venue-details`, {
        venueId,
        ...data,
      });
    },

    // Step 3: Add Working Hours
    addVenueHours: async (
      venueId: number,
      hours: VenueWorkingHours,
    ): Promise<void> => {
      await apiClient.put(`/api/super-admin-venue/add-or-update-venue-hour`, {
        venueId,
        ...hours,
      });
    },

    // Step 4: Add Cuisines
    addVenueCuisines: async (
      venueId: number,
      data: VenueCuisinesData,
    ): Promise<void> => {
      await apiClient.put(
        `/api/super-admin-venue/add-or-update-venue-cuisines`,
        {
          venueId,
          ...data,
        },
      );
    },

    // Step 5: Add Amenities
    addVenueAmenities: async (
      venueId: number,
      data: VenueAmenitiesData,
    ): Promise<void> => {
      await apiClient.put(
        `/api/super-admin-venue/add-or-update-venue-amenities`,
        {venueId, ...data},
      );
    },

    // Step 6: Add Contacts
    addVenueContacts: async (
      venueId: number,
      data: VenueContactData,
    ): Promise<void> => {
      await apiClient.put(
        `/api/super-admin-venue/add-or-update-venue-contact`,
        {
          venueId,
          ...data,
        },
      );
    },

    // Step 7: Add Conditions
    addVenueConditions: async (
      venueId: number,
      data: VenueConditionsData,
    ): Promise<void> => {
      await apiClient.put(
        `/api/super-admin-venue/add-or-update-venue-condition`,
        {venueId, ...data},
      );
    },
    // addVenueDetails: async (venueId: number, data: VenueDetailsData): Promise<void> => {
    //     await apiClient.put(`/api/super-admin-venue/add-venue-details`, { venueId, ...data });
    // },
  };
};
