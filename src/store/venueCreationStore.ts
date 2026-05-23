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

const defaultHours: VenueHoursData['hours'] = {
    monday: { open: '09:00', close: '23:00' },
    tuesday: { open: '09:00', close: '23:00' },
    wednesday: { open: '09:00', close: '23:00' },
    thursday: { open: '09:00', close: '23:00' },
    friday: { open: '09:00', close: '23:00' },
    saturday: { open: '09:00', close: '23:00' },
    sunday: { open: '09:00', close: '23:00' },
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
