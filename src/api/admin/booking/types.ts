export interface BookingListRequest {
  search?: string;
  bookingDate?: "ASC" | "DESC";
  countOfGuests?: "ASC" | "DESC";
  clientName?: "ASC" | "DESC";
  bookingCreatedDate?: "ASC" | "DESC";
}

export interface BookingQueryParams {
  bookingKinds: "ACTIVE" | "HISTORY";
  bookingStatus?:
    | "WAITING"
    | "APPROVED"
    | "REJECTED"
    | "COMPLETED"
    | "NOT_PAID";
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
  typeClientResponse: "NEW" | "LOYAL";
  deposit: string;
  bookingFullVisitTime: number;
  tableTitle?: string;
  tableType?: string;
  tableInFloor?: string;
  countOfGuests: number;
  bookingStatus: "WAITING" | "APPROVED" | "REJECTED" | "COMPLETED" | "NOT_PAID";
  bookingCreatedAd: number;
}

export interface BookingDetail {
  bookingId: number;
  clientId: number;
  clientFullName: string;
  typeClientResponse: "NEW" | "LOYAL";
  deposit: string;
  bookingFullVisitTime: number;
  tableTitle?: string;
  tableType?: string;
  tableInFloor?: string;
  countOfGuests: number;
  bookingStatus: "WAITING" | "APPROVED" | "REJECTED" | "COMPLETED" | "NOT_PAID";
  bookingCreatedAd: number;
  bookingCode: number;
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
