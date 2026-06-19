import {apiClient} from "@/shared/api";
import {
  GetAdminForVenue,
  GetBasicInfoData,
  VenueListItem,
} from "../types/venue.types";
import {
  AmenitiesDataType,
  ContactsDataType,
  GetVenueWorkingHours,
  VenueDetailsType,
  VenueFeedbackData,
} from "@/features/venue";

export const createVenueReadApi = () => {
  return {
    getAllVenues: async (offset = 0, limit = 10): Promise<VenueListItem[]> => {
      const response = await apiClient.get<VenueListItem[]>(
        "/api/super-admin-venue/get-all-venues",
        {
          params: {offset, limit},
        },
      );
      return response.data;
    },

    // Get basic info for a specific venue
    getBasic: async (venueId: number): Promise<GetBasicInfoData> => {
      const response = await apiClient.get<GetBasicInfoData>(
        `/api/super-admin-venue/get-basic/${venueId}`,
      );
      return response.data;
    },

    getDetails: async (venueId: number): Promise<VenueDetailsType> => {
      const response = await apiClient.get<VenueDetailsType>(
        `/api/super-admin-venue/get-details/${venueId}`,
      );
      return response.data;
    },

    getHours: async (venueId: number): Promise<GetVenueWorkingHours> => {
      const response = await apiClient.get<GetVenueWorkingHours>(
        `/api/super-admin-venue/get-hours/${venueId}`,
      );
      return response.data;
    },

    getAmenities: async (venueId: number): Promise<AmenitiesDataType> => {
      const response = await apiClient.get<AmenitiesDataType>(
        `/api/super-admin-venue/get-amenities/${venueId}`,
      );
      return response.data;
    },

    getCuisines: async (venueId: number): Promise<number[]> => {
      const response = await apiClient.get<number[]>(
        `/api/super-admin-venue/get-cuisines/${venueId}`,
      );
      return response.data;
    },

    getContacts: async (venueId: number): Promise<ContactsDataType> => {
      const response = await apiClient.get<ContactsDataType>(
        `/api/super-admin-venue/get-contacts/${venueId}`,
      );
      return response.data;
    },

    getPublicAdmin: async (venueId: number): Promise<GetAdminForVenue> => {
      const response = await apiClient.get<GetAdminForVenue>(
        `/api/super-admin-venue/get-public-admin/${venueId}`,
      );
      return response.data;
    },

    getDescription: async (venueId: number): Promise<{description: string}> => {
      const response = await apiClient.get<{description: string}>(
        `/api/super-admin-venue/get-description/${venueId}`,
      );
      return response.data;
    },

    getFeedbacks: async (
      venueId: number,
      offset: number = 0,
      limit: number = 12,
    ): Promise<VenueFeedbackData[]> => {
      const response = await apiClient.get<VenueFeedbackData[]>(
        `/api/super-admin-venue/feedbacks/${venueId}`,
        {
          params: {offset, limit},
        },
      );
      return response.data;
    },
  };
};
