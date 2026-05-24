import { apiClient } from '../client';

export interface TableResponse {
    id: number;
    number: string | number;
    capacity: number;
    status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
    floor: number;
    type?: string;
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
};
