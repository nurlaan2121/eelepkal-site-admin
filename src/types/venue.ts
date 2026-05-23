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

// ─────────── Venue Creation Types ───────────

export interface City {
    id: number;
    title: string;
    countClients: number;
    countVenues: number;
}

export interface Cuisine {
    id: number;
    name: string;
}

export interface Amenity {
    id: number;
    name: string;
    icon?: string;
}

export interface Capacity {
    title: string;
    value: number;
}

export interface SocialLinks {
    instagram?: string;
    whatsapp?: string;
    telegram?: string;
    facebook?: string;
    website?: string;
}

export interface WorkingHour {
    open: string;
    close: string;
}

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
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

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
