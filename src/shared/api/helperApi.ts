import {Amenity, City, Cuisine} from "../types";
import {apiClient} from "./";

export const createHelperApi = () => {
  return {
    // Helper: Get all cities
    getAllCities: async (): Promise<City[]> => {
      const response = await apiClient.get<City[]>("/api/dev/city/all");
      return response.data;
    },

    // Helper: Get all cuisines with pagination
    getAllCuisines: async (offset = 0, limit = 100): Promise<Cuisine[]> => {
      const response = await apiClient.get<Cuisine[]>("/api/dev/cuisine/all", {
        params: {offset, limit},
      });
      return response.data;
    },

    // Helper: Get all amenities
    getAllAmenities: async (): Promise<Amenity[]> => {
      const response = await apiClient.get<Amenity[]>(
        "/api/dev/amenities/allForUpdate",
      );
      return response.data;
    },
  };
};
