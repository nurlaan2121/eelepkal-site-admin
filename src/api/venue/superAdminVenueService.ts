import { apiClient } from '../client';
import { VenueListItem, AdminForReplace, VenueCondition, PaymentDetail } from '../../types/venue';
import { useAuthStore } from '../../store/authStore';

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
        
        // Get auth token
        const token = useAuthStore.getState().accessToken;
        
        // Send directly to backend, bypassing proxy for file uploads
        const response = await fetch('https://eelepkal.com/api/s3', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                // Don't set Content-Type - let browser set it with boundary
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Upload failed' }));
            throw new Error(error.message || 'Upload failed');
        }

        const result = await response.json();
        return result.data;
    },
};
