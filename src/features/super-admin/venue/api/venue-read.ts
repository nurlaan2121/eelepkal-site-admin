import {apiClient} from "@/api/client";
import {
  BasicInfoData,
  VenueContactData,
  VenueDetailsData,
  VenueListItem,
  VenueWorkingHours,
} from "../types/venue.types";

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
    getBasic: async (
      venueId: number,
    ): Promise<BasicInfoData & {venueId: number}> => {
      const response = await apiClient.get<BasicInfoData & {venueId: number}>(
        `/api/super-admin-venue/get-basic/${venueId}`,
      );
      return response.data;
    },

    getDetails: async (venueId: number): Promise<VenueDetailsData> => {
      const response = await apiClient.get<VenueDetailsData>(
        `/api/super-admin-venue/get-details/${venueId}`,
      );
      return response.data;
    },

    getHours: async (venueId: number): Promise<VenueWorkingHours> => {
      const response = await apiClient.get<VenueWorkingHours>(
        `/api/super-admin-venue/get-hours/${venueId}`,
      );
      return response.data;
    },

    getAmenities: async (venueId: number): Promise<number[]> => {
      const response = await apiClient.get<number[]>(
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

    getContacts: async (venueId: number): Promise<VenueContactData> => {
      const response = await apiClient.get<VenueContactData>(
        `/api/super-admin-venue/get-contacts/${venueId}`,
      );
      return response.data;
    },

    getPublicAdmin: async (venueId: number): Promise<any> => {
      const response = await apiClient.get<any>(
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
      offset = 0,
      limit = 100,
    ): Promise<any[]> => {
      const response = await apiClient.get<any[]>(
        `/api/super-admin-venue/feedbacks/${venueId}`,
        {
          params: {offset, limit},
        },
      );
      return response.data;
    },
  };
};
