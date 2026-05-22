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
    firstImageUrl: string;
    address: string;
    adminFullName: string;
    rating: number;
    averageCheck: number;
}
