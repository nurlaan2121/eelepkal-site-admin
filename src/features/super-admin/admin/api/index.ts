import { apiClient } from "@/api/client";
import { AddPersonalRequest, AdminPersonal, ClaimVenueByLinkRequest, ClaimVenueByLinkResponse, VerifyPersonalOtpRequest } from "../types";

export const superAdminManageOfAdminsService = {
  getAdmins: async (): Promise<AdminPersonal[]> => {
    const response = await apiClient.get<AdminPersonal[]>(
      "/api/super-admin/myPersonal",
    );
    return response.data;
  },

  deleteAdmin: async (adminId: number): Promise<void> => {
    await apiClient.delete(`/api/super-admin/delete-personal/${adminId}`);
  },

  addPersonal: async (
    data: AddPersonalRequest,
  ): Promise<{httpStatus: string; message: string}> => {
    const response = await apiClient.post(
      "/api/super-admin/add-personal-sms",
      data,
    );
    return response.data;
  },

  verifyPersonalOtp: async (data: VerifyPersonalOtpRequest): Promise<void> => {
    await apiClient.post("/api/super-admin/add-personal-verify-sms", data);
  },

  claimVenueByLink: async (
    data: ClaimVenueByLinkRequest,
  ): Promise<ClaimVenueByLinkResponse> => {
    const response = await apiClient.post<ClaimVenueByLinkResponse>(
      "/api/super-admin/venue/claim-by-link",
      data,
    );
    return response.data;
  },
};
