import { apiClient } from '../client';
// import { Venue } from '../../types/venue';

export interface GetAllVenuesResponse {
    id: number;
    name: string;
    address: string;
    description: string;
    venueStatus: string;
    // Add other fields as needed based on openapi.json
}

export const superAdminVenueService = {
    getAllVenues: async (page = 1, pageSize = 10): Promise<GetAllVenuesResponse[]> => {
        const response = await apiClient.get<GetAllVenuesResponse[]>('/api/super-admin-venue/getAllVenues', {
            params: { page, pageSize },
        });
        return response.data;
    },

    deleteVenue: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/super-admin-venue/delete-venue/${id}`);
    },
};
