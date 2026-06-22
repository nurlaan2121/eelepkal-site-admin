export interface VenueDetailsType {
  capacities: Record<string, number>;
  typesOfCuisines: string;
}

export type AmenitiesDataType = Record<string, string>;

export type ContactsDataType = Record<string, string>;

export interface VenueFeedbackData {
  id: number;
  client: {
    id: number;
    image: string | null;
    fullName: string | null;
  };
  text: string;
  rating: number;
  createdAt: string;
}

// Hours Types
export interface DayHours {
  open: string;
  close: string;
  isOff: boolean;
}

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
// Теперь это красиво и типизировано!
export type VenueWorkingHoursType = Record<DayOfWeek, DayHours>;

export interface GetVenueWorkingHours {
  MONDAY: string;
  TUESDAY: string;
  WEDNESDAY: string;
  THURSDAY: string;
  FRIDAY: string;
  SATURDAY: string;
  SUNDAY: string;
}

// Basic

export interface Promo {
  id: number;
  title: string;
  description: string;
  discount: number;
}
export interface GetBasicInfoData {
  address: string;
  averageCheck: number;
  images: Record<number, string>;
  name: string;
  promosRes: Promo[];
  rating: number;
  todayWorkingHours: string;
  venueId: number;
}
export interface GetAdminForVenue {
  fullName: string;
  phoneNumber: string;
}
