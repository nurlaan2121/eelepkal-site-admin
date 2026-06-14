import {Capacity, SocialLinks} from "@/shared/types";

export type VenueStatus = "ACTIVE" | "INACTIVE";

export interface Venue {
  id: number;
  name: string;
  address: string;
  description: string;
  venueStatus: VenueStatus;
  createdAt: string;
  updatedAt: string;
}

export interface VenueCondition {
  venueId: number;
  deposit: number;
  cancelAllowed: boolean;
  cancellationDeadline: string;
  editAllowed: boolean;
  editingDeadline: string;
}

export interface AdminForReplace {
  adminId: number;
  fullName: string;
  email: string;
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

// Venue Creation Types
export interface VenueWorkingHours {
  mondayOpen: string;
  mondayClose: string;
  tuesdayOpen: string;
  tuesdayClose: string;
  wednesdayOpen: string;
  wednesdayClose: string;
  thursdayOpen: string;
  thursdayClose: string;
  fridayOpen: string;
  fridayClose: string;
  saturdayOpen: string;
  saturdayClose: string;
  sundayOpen: string;
  sundayClose: string;
}
// Step 1: Basic Info
export interface BasicInfoData {
  imageUrls: string[];
  schemaImageUrls: string[];
  nameVenue: string;
  description: string;
}

// Step 2: Details
export interface VenueDetailsData {
  cityId: number;
  address: string;
  averageCheck: number;
  capacities: Capacity[];
}

// Step 3: Working Hours
export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface VenueHoursData {
  hours: VenueWorkingHours;
  isDayOff: Record<DayOfWeek, boolean>;
}

// Step 4: Cuisines
export interface VenueCuisinesData {
  cuisinesIds: number[];
}

// Step 5: Amenities
export interface VenueAmenitiesData {
  amenitiesId: number[];
}

// Step 6: Contacts
export interface VenueContactData {
  phoneNumber: string;
  email: string;
  linksSocial: SocialLinks;
}

// Step 7: Conditions
export interface VenueConditionsData {
  deposit: number;
  cancelAllowed: boolean;
  cancellationDeadline: string;
  editAllowed: boolean;
  editingDeadline: string;
}

export interface VenueFeedback {
  id: number;
  client: {
    id: number;
    image: string | null;
    fullName: string;
  };
  text: string;
  rating: number;
  createdAt: string;
}
