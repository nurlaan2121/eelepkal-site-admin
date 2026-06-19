import {apiClient} from "@/shared/api";
import {
  GetPaymentDetailResponse,
  PaymentDetail,
} from "../types/payment-detail.types";

export const createVenuePaymentDetailApi = () => {
  return {
    getPaymentDetails: async (
      venueId: number,
    ): Promise<GetPaymentDetailResponse[]> => {
      const response = await apiClient.get<GetPaymentDetailResponse[]>(
        `/api/super-admin-venue/payment/get-all-payment-details/${venueId}`,
      );
      return response.data;
    },

    addPaymentDetail: async (
      venueId: number,
      data: PaymentDetail,
    ): Promise<void> => {
      await apiClient.post(
        `/api/super-admin-venue/payment/add-payment-detail/${venueId}`,
        data,
      );
    },
    updatePaymentDetail: async (
      paymentId: number,
      data: PaymentDetail,
    ): Promise<void> => {
      await apiClient.put(
        `/api/super-admin-venue/payment/update-payment-detail/${paymentId}`,
        data,
      );
    },

    deletePaymentDetail: async (paymentId: number): Promise<void> => {
      await apiClient.delete(
        `/api/super-admin-venue/payment/delete-payment-detail/${paymentId}`,
      );
    },
  };
};
