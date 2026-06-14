import { apiClient } from ".";

export const createS3Api = () => {
  return {
    uploadFileToS3: async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append("file", file);

      // Use apiClient which goes through the proxy
      // The interceptor will automatically remove Content-Type for FormData
      const response = await apiClient.post("/api/s3", formData);

      return response.data.data;
    },
  };
};
