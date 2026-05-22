import { apiClient } from '../client';
import { VenueListItem } from '../../types/venue';

export const superAdminVenueService = {
    getAllVenues: async (offset = 0, limit = 10): Promise<VenueListItem[]> => {
        const response = await apiClient.get<VenueListItem[]>('/api/super-admin-venue/get-all-venues', {
            params: { offset, limit },
        });
        return response.data;
    },

    deleteVenue: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/super-admin-venue/delete-venue/${id}`);
    },
};
