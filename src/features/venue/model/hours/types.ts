// Shared Types
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
