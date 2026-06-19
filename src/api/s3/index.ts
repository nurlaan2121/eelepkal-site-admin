import {apiClient} from "@/shared/api";

export const s3Service = {
  uploadFile: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post("/api/s3", formData);
    return response.data.data;
  },
};
