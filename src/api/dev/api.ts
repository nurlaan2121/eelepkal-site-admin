import {apiClient} from "@/shared/api";
import {
  MenuCategory,
  MenuCategorySimple,
  MenuUnit,
  TableAmenity,
  TableType,
} from "./types";
import {Amenity, City, Cuisine, EventType} from "@/shared/types";

export const devService = {
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

  // Admin Menu
  getUnits: async (): Promise<MenuUnit[]> => {
    const response = await apiClient.get<MenuUnit[]>(
      "/api/dev/unit-as-enum/all",
    );
    return response.data;
  },

  getCategoriesSimple: async (): Promise<MenuCategorySimple[]> => {
    const response = await apiClient.get<MenuCategorySimple[]>(
      "/api/dev/category/allIdAndNameForAdmin",
    );
    return response.data;
  },

  getCategories: async (): Promise<MenuCategory[]> => {
    const response = await apiClient.get<MenuCategory[]>(
      "/api/dev/category/allIdAndNameForAdmin",
    );
    return response.data;
  },

  // Admin Tables
  getTableTypes: async (): Promise<TableType> => {
    const response = await apiClient.get<TableType>(
      "/api/dev/e-table-type/all",
    );
    return response.data;
  },

  getTableAmenities: async (): Promise<TableAmenity[]> => {
    const response = await apiClient.get<TableAmenity[]>(
      "/api/dev/e-table-amenities/all",
    );
    return response.data;
  },

  getEventTypes: async (): Promise<EventType> => {
    const response = await apiClient.get<EventType>("/api/dev/event-type/all");
    return response.data;
  },
};
