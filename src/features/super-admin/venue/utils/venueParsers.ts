import {
  VenueContactData,
  VenueHoursData,
  VenueWorkingHours,
} from "@/features/super-admin/venue";

export const parseWorkingHours = (rawData: any): VenueWorkingHours => {
  const defaultHours: VenueWorkingHours = {
    mondayOpen: "09:00",
    mondayClose: "23:00",
    tuesdayOpen: "09:00",
    tuesdayClose: "23:00",
    wednesdayOpen: "09:00",
    wednesdayClose: "23:00",
    thursdayOpen: "09:00",
    thursdayClose: "23:00",
    fridayOpen: "09:00",
    fridayClose: "23:00",
    saturdayOpen: "09:00",
    saturdayClose: "23:00",
    sundayOpen: "09:00",
    sundayClose: "23:00",
  };

  if (!rawData || typeof rawData !== "object") return defaultHours;

  const dayMapping: any = {
    MONDAY: "monday",
    TUESDAY: "tuesday",
    WEDNESDAY: "wednesday",
    THURSDAY: "thursday",
    FRIDAY: "friday",
    SATURDAY: "saturday",
    SUNDAY: "sunday",
  };

  const result: any = {...defaultHours};
  Object.entries(rawData).forEach(([key, value]) => {
    const dayKey = dayMapping[key.toUpperCase()];
    if (dayKey && typeof value === "string") {
      // Check if the day is closed ("Выходной" means closed/day off)
      if (value === "Выходной") {
        result[`${dayKey}Open`] = "00:00";
        result[`${dayKey}Close`] = "00:00";
      } else {
        // Try to parse time range format like "09:00 - 23:00"
        const parts = value.split(" - ");
        if (parts.length === 2) {
          result[`${dayKey}Open`] = parts[0].trim();
          result[`${dayKey}Close`] = parts[1].trim();
        }
      }
    }
  });
  return result;
};

export const parseAmenities = (rawData: any): number[] => {
  if (!rawData || typeof rawData !== "object") return [];
  if (Array.isArray(rawData)) return rawData;
  return Object.keys(rawData)
    .map((key) => parseInt(key, 10))
    .filter((id) => !isNaN(id));
};

export const getTodayStatus = (venueHours: VenueWorkingHours) => {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayName = days[new Date().getDay()];
  const open = (venueHours as any)[`${dayName}Open`];
  const close = (venueHours as any)[`${dayName}Close`];
  const isOff = open === "00:00" && close === "00:00";
  return {isOff, hours: `${open || "—"} - ${close || "—"}`, dayName};
};

export const parseContacts = (rawData: any): VenueContactData => {
  if (!rawData || typeof rawData !== "object")
    return {phoneNumber: "", email: "", linksSocial: {}};
  const phoneNumber =
    rawData["phone number"] || rawData["phoneNumber"] || rawData["phone"] || "";
  const email = rawData["email"] || "";
  const linksSocial: any = {};
  Object.entries(rawData).forEach(([key, value]) => {
    if (typeof value !== "string" || !value || value.trim() === "") return;
    const keyLower = key.toLowerCase();
    if (keyLower.includes("instagram")) linksSocial.instagram = value;
    else if (
      keyLower.includes("whatsapp") ||
      keyLower.includes("whatsup") ||
      keyLower === "wa"
    )
      linksSocial.whatsapp = value;
    else if (keyLower.includes("telegram") || keyLower === "tg")
      linksSocial.telegram = value;
    else if (keyLower.includes("facebook") || keyLower === "fb")
      linksSocial.facebook = value;
    else if (keyLower.includes("2gis") || keyLower.includes("2гис"))
      linksSocial.website = value;
    else if (
      keyLower.includes("website") ||
      keyLower.includes("сайт") ||
      keyLower.includes("site")
    )
      linksSocial.website = value;
  });
  return {
    phoneNumber: typeof phoneNumber === "string" ? phoneNumber.trim() : "",
    email: typeof email === "string" ? email.trim() : "",
    linksSocial,
  };
};
export const getImageData = (data: any): {id: number; url: string}[] => {
  if (!data) return [];
  if (data.images && typeof data.images === "object") {
    return Object.entries(data.images).map(([id, url]) => ({
      id: parseInt(id, 10),
      url: url as string,
    }));
  }
  return [];
};
