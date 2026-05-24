import { apiClient } from '../client';

export interface MenuUnit {
    id: number;
    name: string;
}

export interface MenuCategorySimple {
    id: number;
    name: string;
}

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

export interface MenuItemFull {
    id: number;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    addressVenue: string;
    unit: string;
    value: string;
    favorite: boolean;
}

export interface CreateMenuRequest {
    imageUrl: string;
    categoryId: number;
    title: string;
    description: string;
    price: number;
    meaning: string;
    unitAsEnumId: number;
}

export interface MenuResponse {
    totalMenus: number;
    getMenuResponse: MenuItem[];
}

export type MenuStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED';

export const adminMenuService = {
    uploadImageToS3: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post('/api/s3', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data;
    },

    getUnits: async (): Promise<MenuUnit[]> => {
        const response = await apiClient.get<MenuUnit[]>('/api/dev/unit-as-enum/all');
        return response.data;
    },

    getCategoriesSimple: async (): Promise<MenuCategorySimple[]> => {
        const response = await apiClient.get<MenuCategorySimple[]>('/api/dev/category/allIdAndName');
        return response.data;
    },

    getCategories: async (): Promise<MenuCategory[]> => {
        const response = await apiClient.get<MenuCategory[]>('/api/dev/category/allIdAndName');
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
        await apiClient.put(`/api/admin-menu/replace-status/${menuId}`, null, {
            params: { status },
        });
    },

    getMenuItem: async (menuId: number): Promise<MenuItemFull> => {
        const response = await apiClient.get<MenuItemFull>(`/api/guest-menu/get/${menuId}`);
        return response.data;
    },

    updateMenu: async (menuId: number, data: CreateMenuRequest): Promise<MenuItem> => {
        const response = await apiClient.put<MenuItem>(`/api/admin-menu/updateMenu/${menuId}`, data);
        return response.data;
    },

    deleteMenu: async (menuId: number): Promise<void> => {
        await apiClient.delete(`/api/admin-menu/${menuId}`);
    },

    createMenu: async (data: CreateMenuRequest, status: MenuStatus = 'INACTIVE'): Promise<MenuItem> => {
        const response = await apiClient.post<MenuItem>('/api/admin-menu/add', data, {
            params: { status },
        });
        return response.data;
    },
};
