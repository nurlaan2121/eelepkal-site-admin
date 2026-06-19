import {VenueContactData} from "@/api/super-admin/venue";
import {DayOfWeek, VenueWorkingHoursType} from "../model/hours/types";
import {z} from "zod";
import {SocialLinks} from "@/shared/types";

const days: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const getTodayStatus = (venueHours: VenueWorkingHoursType) => {
  const dayName = days[new Date().getDay()];
  const {open, close, isOff} = venueHours[dayName];

  return {
    isOff,
    hours: isOff ? "Выходной" : `${open} - ${close}`,
    dayName,
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

// Описываем структуру одного дня
const DaySchema = z.string().default("09:00 - 23:00");

// Схема, которая сама превращает "кривой" JSON в красивый объект
export const WorkingHoursSchema = z.record(DaySchema).transform((data) => {
  const result: VenueWorkingHoursType = {
    monday: {open: "09:00", close: "23:00", isOff: false},
    tuesday: {open: "09:00", close: "23:00", isOff: false},
    wednesday: {open: "09:00", close: "23:00", isOff: false},
    thursday: {open: "09:00", close: "23:00", isOff: false},
    friday: {open: "09:00", close: "23:00", isOff: false},
    saturday: {open: "09:00", close: "23:00", isOff: false},
    sunday: {open: "09:00", close: "23:00", isOff: false},
  };
  if (!data) return result;

  days.forEach((day) => {
    // Ищем ключ в данных (поддерживаем MONDAY и monday)
    const rawValue = data[day.toUpperCase()] || "09:00 - 23:00";

    if (rawValue === "Выходной") {
      result[day] = {open: "00:00", close: "00:00", isOff: true};
    } else {
      const [open, close] = rawValue.split(" - ");
      result[day] = {
        open: open || "09:00",
        close: close || "23:00",
        isOff: false,
      };
    }
  });

  return result;
});
