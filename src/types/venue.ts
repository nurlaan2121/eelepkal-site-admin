export type VenueStatus = 'ACTIVE' | 'INACTIVE';

export interface Venue {
    id: number;
    name: string;
    address: string;
    description: string;
    venueStatus: VenueStatus;
    createdAt: string;
    updatedAt: string;
}

export interface VenueListItem {
    venueId: number;
    name: string;
    firstImageUrl: string | null;
    address: string;
    adminFullName: string;
    rating: number;
    averageCheck: number;
}

export interface AdminForReplace {
    adminId: number;
    fullName: string;
    email: string;
}

export interface VenueCondition {
    venueId: number;
    deposit: number;
    cancelAllowed: boolean;
    cancellationDeadline: string;
    editAllowed: boolean;
    editingDeadline: string;
}

export interface PaymentDetail {
    id: number;
    venueTitle: string;
    taxIdentificationNumber: string;
    bankAccountNumber: string;
    bankName: string;
    qrcodeUrl: string;
}
