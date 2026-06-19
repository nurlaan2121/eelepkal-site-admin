import {apiClient} from "@/shared/api";
import {
  CreateMenuRequest,
  MenuItem,
  MenuItemFull,
  MenuResponse,
  MenuStatus,
} from "./types";

export const adminMenuService = {
  getAllMenus: async (params: {
    categoryId: number;
    status: MenuStatus;
    page?: number;
    pageSize?: number;
  }): Promise<MenuResponse> => {
    const {categoryId, status, page = 1, pageSize = 10} = params;
    const response = await apiClient.get<MenuResponse>(
      "/api/admin-menu/getAllMenus",
      {
        params: {
          categoryId,
          status,
          page,
          pageSize,
        },
      },
    );
    return response.data;
  },

  updateMenuStatus: async (
    menuId: number,
    status: MenuStatus,
  ): Promise<void> => {
    await apiClient.put(`/api/admin-menu/replace-status/${menuId}`, null, {
      params: {status},
    });
  },

  getMenuItem: async (menuId: number): Promise<MenuItemFull> => {
    const response = await apiClient.get<MenuItemFull>(
      `/api/guest-menu/get/${menuId}`,
    );
    return response.data;
  },

  updateMenu: async (
    menuId: number,
    data: CreateMenuRequest,
  ): Promise<MenuItem> => {
    const response = await apiClient.put<MenuItem>(
      `/api/admin-menu/updateMenu/${menuId}`,
      data,
    );
    return response.data;
  },

  deleteMenu: async (menuId: number): Promise<void> => {
    await apiClient.delete(`/api/admin-menu/delete/${menuId}`);
  },

  createMenu: async (
    data: CreateMenuRequest,
    status: MenuStatus = "INACTIVE",
  ): Promise<MenuItem> => {
    const response = await apiClient.post<MenuItem>(
      "/api/admin-menu/add",
      data,
      {
        params: {status},
      },
    );
    return response.data;
  },
};
