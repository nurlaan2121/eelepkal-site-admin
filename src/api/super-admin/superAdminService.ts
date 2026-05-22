import { apiClient } from '../client';
import { VenueListItem } from '../../types/venue';

export const superAdminService = {
    getAllVenues: async (offset = 0, limit = 10): Promise<VenueListItem[]> => {
        const response = await apiClient.get<VenueListItem[]>(
            `/api/super-admin-venue/get-all-venues?offset=${offset}&limit=${limit}`
        );
        return response.data;
    },
};
