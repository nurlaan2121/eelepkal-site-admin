import { apiClient } from '../client';
import { 
    VenueListItem, 
    AdminForReplace, 
    VenueCondition, 
    PaymentDetail,
    City,
    Cuisine,
    Amenity,
    BasicInfoData,
    VenueDetailsData,
    VenueWorkingHours,
    VenueCuisinesData,
    VenueAmenitiesData,
    VenueContactData,
    VenueConditionsData,
} from '../../types/venue';

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

    getAdminsForReplace: async (): Promise<AdminForReplace[]> => {
        const response = await apiClient.get<AdminForReplace[]>('/api/super-admin/get-admins-for-replace');
        return response.data;
    },

    replaceAdmin: async (venueId: number, newAdminId: number): Promise<void> => {
        await apiClient.post(`/api/super-admin/replace-admin/${venueId}/${newAdminId}`);
    },

    updateVenueCondition: async (condition: VenueCondition): Promise<void> => {
        await apiClient.put('/api/super-admin-venue/add-or-update-venue-condition', condition);
    },

    getPaymentDetails: async (venueId: number): Promise<PaymentDetail[]> => {
        const response = await apiClient.get<PaymentDetail[]>(`/api/super-admin-venue/payment/get-all-payment-details/${venueId}`);
        return response.data;
    },

    addPaymentDetail: async (venueId: number, data: {
        venueTitle: string;
        taxIdentificationNumber: string;
        bankAccountNumber: string;
        bankName: string;
        qrCodeUrl: string;
    }): Promise<void> => {
        await apiClient.post(`/api/super-admin-venue/payment/add-payment-detail/${venueId}`, data);
    },

    uploadFileToS3: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        
        // Use apiClient which goes through the proxy
        // The interceptor will automatically remove Content-Type for FormData
        const response = await apiClient.post('/api/s3', formData);
        
        return response.data.data;
    },

    updatePaymentDetail: async (paymentId: number, data: {
        venueTitle: string;
        taxIdentificationNumber: string;
        bankAccountNumber: string;
        bankName: string;
        qrCodeUrl: string;
    }): Promise<void> => {
        await apiClient.put(`/api/super-admin-venue/payment/update-payment-detail/${paymentId}`, data);
    },

    deletePaymentDetail: async (paymentId: number): Promise<void> => {
        await apiClient.delete(`/api/super-admin-venue/payment/delete-payment-detail/${paymentId}`);
    },

    // ─────────── Venue Creation API Methods ───────────

    // Step 1: Add Basic Info
    addBasicInfo: async (data: BasicInfoData): Promise<{ idVenue: number }> => {
        const response = await apiClient.post<{ idVenue: number }>('/api/super-admin-venue/add-basic', data);
        return response.data;
    },

    // Step 2: Add Venue Details
    addVenueDetails: async (venueId: number, data: VenueDetailsData): Promise<void> => {
        await apiClient.put(`/api/super-admin-venue/add-venue-details/${venueId}`, data);
    },

    // Step 3: Add Working Hours
    addVenueHours: async (venueId: number, hours: VenueWorkingHours): Promise<void> => {
        await apiClient.put(`/api/super-admin-venue/add-or-update-venue-hour/${venueId}`, hours);
    },

    // Step 4: Add Cuisines
    addVenueCuisines: async (venueId: number, data: VenueCuisinesData): Promise<void> => {
        await apiClient.put(`/api/super-admin-venue/add-or-update-venue-cuisines/${venueId}`, data);
    },

    // Step 5: Add Amenities
    addVenueAmenities: async (venueId: number, data: VenueAmenitiesData): Promise<void> => {
        await apiClient.put(`/api/super-admin-venue/add-or-update-venue-amenities/${venueId}`, data);
    },

    // Step 6: Add Contacts
    addVenueContacts: async (venueId: number, data: VenueContactData): Promise<void> => {
        await apiClient.put(`/api/super-admin-venue/add-or-update-venue-contact/${venueId}`, data);
    },

    // Step 7: Add Conditions
    addVenueConditions: async (venueId: number, data: VenueConditionsData): Promise<void> => {
        await apiClient.put(`/api/super-admin-venue/add-or-update-venue-condition/${venueId}`, data);
    },

    // Helper: Get all cities
    getAllCities: async (): Promise<City[]> => {
        const response = await apiClient.get<City[]>('/api/dev/city/all');
        return response.data;
    },

    // Helper: Get all cuisines with pagination
    getAllCuisines: async (offset = 0, limit = 100): Promise<Cuisine[]> => {
        const response = await apiClient.get<Cuisine[]>('/api/dev/cuisine/all', {
            params: { offset, limit },
        });
        return response.data;
    },

    // Helper: Get all amenities
    getAllAmenities: async (): Promise<Amenity[]> => {
        const response = await apiClient.get<Amenity[]>('/api/dev/amenities/allForUpdate');
        return response.data;
    },
};
