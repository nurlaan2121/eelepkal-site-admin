import { apiClient } from '../client';

export interface TableResponse {
    etableId: number;
    tableTitle: string;
    tableType: string;
    capacity: string;
    tableStatus: 'OPEN' | 'BUSY' | 'RSVN' | string;
}

export interface TableDetail {
    images: {
        [imageId: string]: string; // key is imageId, value is imageUrl
    };
    capacity: string;
    title: string;
    inFloor: number;
    price: string;
    description: string;
    amenities: string[];
    eventTypes: string[];
    etableId: number;
    etableType: string;
}

export interface TablesListResponse {
    tableGetAllResponses: TableResponse[];
    countOpen: number;
    countBusy: number;
    countWaiting: number;
}

export interface GetTablesParams {
    date: string;
    floor?: number;
    offset?: number;
    limit?: number;
}

export interface TableType {
    [key: string]: number;
}

export interface TableAmenity {
    id: number;
    title: string;
}

export interface EventType {
    [key: string]: number;
}

export interface CreateTableRequest {
    inFloor: number;
    tableTypeId: number;
    imageUrls: string[];
    title: string;
    capacityMin: number;
    capacityMax: number;
    deposit: string;
    description: string;
    tableAmenitiesIds: number[];
    eventTypeIds: number[];
}

export interface UpdateTableBasicRequest {
    inFloor: number;
    title: string;
    capacityMin: number;
    capacityMax: number;
    deposit: string;
    description: string;
}

export const adminTableService = {
    getAllTables: async (params: GetTablesParams): Promise<TablesListResponse> => {
        const { date, floor = 1, offset = 0, limit = 50 } = params;
        const response = await apiClient.get<TablesListResponse>('/api/admin-table/get-all-tables-as-list', {
            params: {
                date,
                floor,
                offset,
                limit,
            },
        });
        return response.data;
    },

    getTableTypes: async (): Promise<TableType> => {
        const response = await apiClient.get<TableType>('/api/dev/e-table-type/all');
        return response.data;
    },

    getTableAmenities: async (): Promise<TableAmenity[]> => {
        const response = await apiClient.get<TableAmenity[]>('/api/dev/e-table-amenities/all');
        return response.data;
    },

    getEventTypes: async (): Promise<EventType> => {
        const response = await apiClient.get<EventType>('/api/dev/event-type/all');
        return response.data;
    },

    addTable: async (data: CreateTableRequest): Promise<void> => {
        await apiClient.post('/api/admin-table/add-new', data);
    },

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

    addTableImage: async (tableId: number, imageUrl: string): Promise<void> => {
        await apiClient.post(`/api/admin-table/add-image/${tableId}`, null, {
            params: { url: imageUrl },
        });
    },

    deleteTableImage: async (tableId: number, imageId: number): Promise<void> => {
        await apiClient.delete(`/api/admin-table/delete-image/${tableId}/${imageId}`);
    },

    getTableById: async (tableId: number): Promise<TableDetail> => {
        const response = await apiClient.get<TableDetail>(`/api/admin-table/getTableByIdForUpdate/${tableId}`);
        return response.data;
    },

    getTableEventTypes: async (tableId: number): Promise<EventType> => {
        const response = await apiClient.get<EventType>(`/api/admin-table/get-event-types/${tableId}`);
        return response.data;
    },

    getTableServices: async (tableId: number): Promise<{ [key: string]: string }> => {
        const response = await apiClient.get<{ [key: string]: string }>(`/api/admin-table/get-et-services/${tableId}`);
        return response.data;
    },

    updateTableBasic: async (tableId: number, data: UpdateTableBasicRequest): Promise<void> => {
        await apiClient.put(`/api/admin-table/update/${tableId}`, data);
    },

    updateTableEventTypes: async (tableId: number, eventTypeIds: number[]): Promise<void> => {
        const params = new URLSearchParams();
        eventTypeIds.forEach(id => params.append('eventTypeIdsForAssign', id.toString()));
        
        await apiClient.put(`/api/admin-table/update-event-types/${tableId}?${params.toString()}`);
    },

    updateTableType: async (tableId: number, eTableTypeId: number): Promise<void> => {
        await apiClient.put(`/api/admin-table/update-et-type/${tableId}`, null, {
            params: { eTableTypeId },
        });
    },

    updateTableServices: async (tableId: number, eTableServiceIds: number[]): Promise<void> => {
        const params = new URLSearchParams();
        eTableServiceIds.forEach(id => params.append('eTableServiceIdsForAssign', id.toString()));
        
        await apiClient.put(`/api/admin-table/update-et-services/${tableId}?${params.toString()}`);
    },

    deleteTable: async (tableId: number): Promise<{ httpStatus: string; message: string }> => {
        const response = await apiClient.delete<{ httpStatus: string; message: string }>(
            `/api/admin-table/delete/${tableId}`
        );
        return response.data;
    },

    updateTableStatus: async (tableId: number, date: string, action: 'OPEN' | 'CLOSE'): Promise<void> => {
        await apiClient.put(`/api/admin-table/update-status-table/${tableId}`, null, {
            params: {
                date,
                tableStatusActionRequest: action,
            },
        });
    },
};
