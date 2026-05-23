import { apiClient } from '../client';
import { VenueListItem, AdminForReplace, VenueCondition, PaymentDetail } from '../../types/venue';

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
};
