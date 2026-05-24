import { apiClient } from '../client';

export interface AdminVenueBasic {
    venueId: number;
    images: Record<string, string>;
    name: string;
    todayWorkingHours: string;
    address: string;
    averageCheck: number;
    rating: number;
    promosRes: any[];
    favoriteForClient: boolean;
}

export interface AdminVenueDetails {
    capacities: Record<string, number>;
    typesOfCuisines: string;
}

export interface AdminVenueWorkingHours {
    MONDAY: string;
    TUESDAY: string;
    WEDNESDAY: string;
    THURSDAY: string;
    FRIDAY: string;
    SATURDAY: string;
    SUNDAY: string;
}

export interface AdminVenueAmenities {
    [key: string]: string;
}

export interface AdminVenueContacts {
    email: string;
    'phone number': string;
    instagram: string;
    telegram: string;
    website: string;
    facebook: string;
    whatsapp: string;
}

export interface AdminVenuePublicAdmin {
    fullName: string;
    phoneNumber: string;
}

export interface AdminVenueFeedback {
    id: number;
    client: {
        id: number;
        image: string | null;
        fullName: string | null;
    };
    text: string;
    rating: number;
    createdAt: string;
}

export const adminVenueService = {
    getBasic: async (): Promise<AdminVenueBasic> => {
        const response = await apiClient.get<AdminVenueBasic>('/api/admin-venue/get-basic');
        return response.data;
    },

    getDetails: async (): Promise<AdminVenueDetails> => {
        const response = await apiClient.get<AdminVenueDetails>('/api/admin-venue/get-details');
        return response.data;
    },

    getHours: async (): Promise<AdminVenueWorkingHours> => {
        const response = await apiClient.get<AdminVenueWorkingHours>('/api/admin-venue/get-hours');
        return response.data;
    },

    getAmenities: async (): Promise<AdminVenueAmenities> => {
        const response = await apiClient.get<AdminVenueAmenities>('/api/admin-venue/get-amenities');
        return response.data;
    },

    getContacts: async (): Promise<AdminVenueContacts> => {
        const response = await apiClient.get<AdminVenueContacts>('/api/admin-venue/get-contacts');
        return response.data;
    },

    getPublicAdmin: async (): Promise<AdminVenuePublicAdmin> => {
        const response = await apiClient.get<AdminVenuePublicAdmin>('/api/admin-venue/get-public-admin');
        return response.data;
    },

    getDescription: async (): Promise<string> => {
        const response = await apiClient.get<string>('/api/admin-venue/get-description', {
            headers: {
                'Accept': 'text/plain;charset=UTF-8'
            }
        });
        return response.data;
    },

    getFeedbacks: async (venueId: number, offset: number = 0, limit: number = 12): Promise<AdminVenueFeedback[]> => {
        const response = await apiClient.get<AdminVenueFeedback[]>(
            `/api/admin-venue/feedbacks/${venueId}`,
            { params: { offset, limit } }
        );
        return response.data;
    },
};
