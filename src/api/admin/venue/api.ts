import {apiClient} from "@/shared/api";
import {
  GetVenueWorkingHours,
  VenueDetailsType,
  AmenitiesDataType,
  ContactsDataType,
  VenueFeedbackData,
  GetBasicInfoData,
  GetAdminForVenue,
} from "@/features/venue-detail";

export const adminVenueService = {
  getBasic: async (): Promise<GetBasicInfoData> => {
    const response = await apiClient.get<GetBasicInfoData>(
      "/api/admin-venue/get-basic",
    );
    return response.data;
  },

  getDetails: async (): Promise<VenueDetailsType> => {
    const response = await apiClient.get<VenueDetailsType>(
      "/api/admin-venue/get-details",
    );
    return response.data;
  },

  getHours: async (): Promise<GetVenueWorkingHours> => {
    const response = await apiClient.get<GetVenueWorkingHours>(
      "/api/admin-venue/get-hours",
    );
    return response.data;
  },

  getAmenities: async (): Promise<AmenitiesDataType> => {
    const response = await apiClient.get<AmenitiesDataType>(
      "/api/admin-venue/get-amenities",
    );
    return response.data;
  },

  getContacts: async (): Promise<ContactsDataType> => {
    const response = await apiClient.get<ContactsDataType>(
      "/api/admin-venue/get-contacts",
    );
    return response.data;
  },

  getPublicAdmin: async (): Promise<GetAdminForVenue> => {
    const response = await apiClient.get<GetAdminForVenue>(
      "/api/admin-venue/get-public-admin",
    );
    return response.data;
  },

  getDescription: async (): Promise<string> => {
    const response = await apiClient.get<string>(
      "/api/admin-venue/get-description",
      {
        headers: {
          Accept: "text/plain;charset=UTF-8",
        },
      },
    );
    return response.data;
  },

  getFeedbacks: async (
    venueId: number,
    offset: number = 0,
    limit: number = 12,
  ): Promise<VenueFeedbackData[]> => {
    const response = await apiClient.get<VenueFeedbackData[]>(
      `/api/admin-venue/feedbacks/${venueId}`,
      {params: {offset, limit}},
    );
    return response.data;
  },
};
