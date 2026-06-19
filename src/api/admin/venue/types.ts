export interface AdminVenueBasic {
  venueId: number;
  images: Record<string, string>;
  name: string;
  todayWorkingHours: string;
  address: string;
  averageCheck: number;
  rating: number;
  promosRes: any[];
  favoriteForClient: boolean;
}

export interface AdminVenuePublicAdmin {
  fullName: string;
  phoneNumber: string;
}
