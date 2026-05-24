import { apiClient } from '../client';

export interface BookingListRequest {
    search?: string;
    bookingDate?: 'ASC' | 'DESC';
    countOfGuests?: 'ASC' | 'DESC';
    clientName?: 'ASC' | 'DESC';
    bookingCreatedDate?: 'ASC' | 'DESC';
}

export interface BookingQueryParams {
    bookingKinds: 'ACTIVE' | 'HISTORY';
    bookingStatus?: 'WAITING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'NOT_PAID';
    date?: string;
    offset?: number;
    limit?: number;
}

export interface BookingResponse {
    bookingId: number;
    clientId: number;
    ulrProfileImageClient?: string;
    clientFullName: string;
    clientAge: number;
    typeClientResponse: 'NEW' | 'LOYAL';
    deposit: string;
    bookingFullVisitTime: string;
    tableTitle?: string;
    tableType?: string;
    tableInFloor?: string;
    countOfGuests: number;
    bookingStatus: 'WAITING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'NOT_PAID';
    bookingCreatedAd: string;
}

export interface BookingDetail {
    bookingId: number;
    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    date: string;
    time: string;
    guestsCount: number;
    status: string;
    tableId?: number;
    tableNumber?: string;
    tableTitle?: string;
    eventType?: string;
    deposit?: string;
    comment?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AvailableTable {
    etableId: number;
    tableTitle: string;
    tableType: string;
    capacity: string;
    tableStatus: string;
}

export interface BookingCountResponse {
    totalCount: number;
    pendingCount: number;
    confirmedCount: number;
    cancelledCount: number;
    completedCount: number;
}

export const adminBookingService = {
    getAllBookings: async (queryParams: BookingQueryParams, sortOptions?: BookingListRequest): Promise<BookingResponse[]> => {
        const requestBody = {
            search: sortOptions?.search || '',
            bookingDate: sortOptions?.bookingDate || 'ASC',
            countOfGuests: sortOptions?.countOfGuests || 'ASC',
            clientName: sortOptions?.clientName || 'ASC',
            bookingCreatedDate: sortOptions?.bookingCreatedDate || 'ASC',
        };

        const response = await apiClient.post<BookingResponse[]>('/api/admin-booking/get-all', requestBody, {
            params: {
                bookingKinds: queryParams.bookingKinds,
                ...(queryParams.bookingStatus && { bookingStatus: queryParams.bookingStatus }),
                ...(queryParams.date && { date: queryParams.date }),
                ...(queryParams.offset !== undefined && { offset: queryParams.offset }),
                ...(queryParams.limit !== undefined && { limit: queryParams.limit }),
            },
        });
        return response.data;
    },

    getBookingDetails: async (bookingId: number): Promise<BookingDetail> => {
        const response = await apiClient.get<BookingDetail>(`/api/admin-booking/get-details/${bookingId}`);
        return response.data;
    },

    getAvailableTables: async (bookingId: number): Promise<AvailableTable[]> => {
        const response = await apiClient.get<AvailableTable[]>(`/api/admin-booking/get-tables-for-assign/${bookingId}`);
        return response.data;
    },

    assignTable: async (bookingId: number, tableId: number): Promise<void> => {
        await apiClient.put(`/api/admin-booking/assign-table-to-booking/${bookingId}/${tableId}`);
    },

    acceptOrReject: async (bookingId: number, accept: boolean): Promise<void> => {
        await apiClient.put(`/api/admin-booking/accept-or-reject/${bookingId}`, null, {
            params: { action: accept },
        });
    },

    getBookingCounts: async (): Promise<BookingCountResponse> => {
        const response = await apiClient.get<BookingCountResponse>('/api/admin-booking/get-sort-count');
        return response.data;
    },
};
