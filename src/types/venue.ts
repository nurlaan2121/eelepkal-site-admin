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
