import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    BasicInfoData,
    VenueDetailsData,
    VenueHoursData,
    VenueCuisinesData,
    VenueAmenitiesData,
    VenueContactData,
    VenueConditionsData,
    DayOfWeek,
    VenueWorkingHours,
} from '../types/venue';

interface VenueCreationState {
    // Core state
    venueId: number | null;
    currentStep: number;
    
    // Step data
    basicInfo: Partial<BasicInfoData>;
    details: Partial<VenueDetailsData>;
    hours: Partial<VenueHoursData>;
    cuisines: Partial<VenueCuisinesData>;
    amenities: Partial<VenueAmenitiesData>;
    contacts: Partial<VenueContactData>;
    conditions: Partial<VenueConditionsData>;
    
    // Actions
    setVenueId: (id: number) => void;
    setCurrentStep: (step: number) => void;
    setBasicInfo: (data: Partial<BasicInfoData>) => void;
    setDetails: (data: Partial<VenueDetailsData>) => void;
    setHours: (data: Partial<VenueHoursData>) => void;
    setCuisines: (data: Partial<VenueCuisinesData>) => void;
    setAmenities: (data: Partial<VenueAmenitiesData>) => void;
    setContacts: (data: Partial<VenueContactData>) => void;
    setConditions: (data: Partial<VenueConditionsData>) => void;
    
    // Reset
    resetCreation: () => void;
}

const defaultHours: VenueWorkingHours = {
    MondayOpen: '09:00',
    MondayClose: '23:00',
    TuesdayOpen: '09:00',
    TuesdayClose: '23:00',
    WednesdayOpen: '09:00',
    WednesdayClose: '23:00',
    ThursdayOpen: '09:00',
    ThursdayClose: '23:00',
    FridayOpen: '09:00',
    FridayClose: '23:00',
    SaturdayOpen: '09:00',
    SaturdayClose: '23:00',
    SundayOpen: '09:00',
    SundayClose: '23:00',
};

const defaultIsDayOff: Record<DayOfWeek, boolean> = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
};

export const useVenueCreationStore = create<VenueCreationState>()(
    persist(
        (set) => ({
            // Initial state
            venueId: null,
            currentStep: 1,
            basicInfo: {},
            details: {},
            hours: {
                hours: defaultHours,
                isDayOff: defaultIsDayOff,
            },
            cuisines: {},
            amenities: {},
            contacts: {},
            conditions: {},
            
            // Actions
            setVenueId: (id) => set({ venueId: id }),
            setCurrentStep: (step) => set({ currentStep: step }),
            setBasicInfo: (data) => set((state) => ({
                basicInfo: { ...state.basicInfo, ...data }
            })),
            setDetails: (data) => set((state) => ({
                details: { ...state.details, ...data }
            })),
            setHours: (data) => set((state) => ({
                hours: { ...state.hours, ...data }
            })),
            setCuisines: (data) => set((state) => ({
                cuisines: { ...state.cuisines, ...data }
            })),
            setAmenities: (data) => set((state) => ({
                amenities: { ...state.amenities, ...data }
            })),
            setContacts: (data) => set((state) => ({
                contacts: { ...state.contacts, ...data }
            })),
            setConditions: (data) => set((state) => ({
                conditions: { ...state.conditions, ...data }
            })),
            
            // Reset
            resetCreation: () => set({
                venueId: null,
                currentStep: 1,
                basicInfo: {},
                details: {},
                hours: {
                    hours: defaultHours,
                    isDayOff: defaultIsDayOff,
                },
                cuisines: {},
                amenities: {},
                contacts: {},
                conditions: {},
            }),
        }),
        {
            name: 'venue-creation-draft',
            partialize: (state) => ({
                venueId: state.venueId,
                currentStep: state.currentStep,
                basicInfo: state.basicInfo,
                details: state.details,
                hours: state.hours,
                cuisines: state.cuisines,
                amenities: state.amenities,
                contacts: state.contacts,
                conditions: state.conditions,
            }),
        }
    )
);
