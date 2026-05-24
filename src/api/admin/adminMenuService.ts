import { apiClient } from '../client';

export interface MenuCategory {
    id: number;
    name: string;
    count?: number;
}

export interface MenuItem {
    id: number;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
}

export interface MenuResponse {
    totalMenus: number;
    getMenuResponse: MenuItem[];
}

export type MenuStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED';

export const adminMenuService = {
    getCategories: async (): Promise<MenuCategory[]> => {
        const response = await apiClient.get<MenuCategory[]>('/api/admin-menu/getCategories');
        return response.data;
    },

    getAllMenus: async (params: {
        categoryId: number;
        status: MenuStatus;
        page?: number;
        pageSize?: number;
    }): Promise<MenuResponse> => {
        const { categoryId, status, page = 1, pageSize = 10 } = params;
        const response = await apiClient.get<MenuResponse>('/api/admin-menu/getAllMenus', {
            params: {
                categoryId,
                status,
                page,
                pageSize,
            },
        });
        return response.data;
    },

    updateMenuStatus: async (menuId: number, status: MenuStatus): Promise<void> => {
        await apiClient.patch(`/api/admin-menu/${menuId}/status`, { status });
    },

    deleteMenu: async (menuId: number): Promise<void> => {
        await apiClient.delete(`/api/admin-menu/${menuId}`);
    },

    updateMenu: async (menuId: number, data: Partial<MenuItem>): Promise<MenuItem> => {
        const response = await apiClient.patch<MenuItem>(`/api/admin-menu/${menuId}`, data);
        return response.data;
    },

    createMenu: async (data: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
        const response = await apiClient.post<MenuItem>('/api/admin-menu', data);
        return response.data;
    },
};
