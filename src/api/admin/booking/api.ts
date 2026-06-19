import {apiClient} from "@/shared/api";
import {
  AvailableTable,
  BookingCountResponse,
  BookingDetail,
  BookingListRequest,
  BookingQueryParams,
  BookingResponse,
} from "./types";

export const adminBookingService = {
  getAllBookings: async (
    queryParams: BookingQueryParams,
    sortOptions?: BookingListRequest,
  ): Promise<BookingResponse[]> => {
    const requestBody = {
      search: sortOptions?.search || "",
      bookingDate: sortOptions?.bookingDate || "ASC",
      countOfGuests: sortOptions?.countOfGuests || "ASC",
      clientName: sortOptions?.clientName || "ASC",
      bookingCreatedDate: sortOptions?.bookingCreatedDate || "ASC",
    };

    const response = await apiClient.post<BookingResponse[]>(
      "/api/admin-booking/get-all",
      requestBody,
      {
        params: {
          bookingKinds: queryParams.bookingKinds,
          ...(queryParams.bookingStatus && {
            bookingStatus: queryParams.bookingStatus,
          }),
          ...(queryParams.date && {date: queryParams.date}),
          ...(queryParams.offset !== undefined && {offset: queryParams.offset}),
          ...(queryParams.limit !== undefined && {limit: queryParams.limit}),
        },
      },
    );
    return response.data;
  },

  getBookingDetails: async (bookingId: number): Promise<BookingDetail> => {
    const response = await apiClient.get<BookingDetail>(
      `/api/admin-booking/get-details/${bookingId}`,
    );
    return response.data;
  },

  getAvailableTables: async (bookingId: number): Promise<AvailableTable[]> => {
    const response = await apiClient.get<AvailableTable[]>(
      `/api/admin-booking/get-tables-for-assign/${bookingId}`,
    );
    return response.data;
  },

  assignTable: async (bookingId: number, tableId: number): Promise<void> => {
    await apiClient.put(
      `/api/admin-booking/assign-table-to-booking/${bookingId}/${tableId}`,
    );
  },

  acceptOrReject: async (bookingId: number, accept: boolean): Promise<void> => {
    await apiClient.put(
      `/api/admin-booking/accept-or-reject/${bookingId}`,
      null,
      {
        params: {action: accept},
      },
    );
  },

  getBookingCounts: async (): Promise<BookingCountResponse> => {
    const response = await apiClient.get<BookingCountResponse>(
      "/api/admin-booking/get-sort-count",
    );
    return response.data;
  },
};
