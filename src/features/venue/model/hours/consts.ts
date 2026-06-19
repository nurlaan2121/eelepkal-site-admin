import {DayOfWeek} from "./types";

export type DayConfig = {
  key: DayOfWeek; // Строго ограничиваем ключами из твоего интерфейса
  label: string;
};

export const DAYS: DayConfig[] = [
  {key: "monday", label: "Понедельник"},
  {key: "tuesday", label: "Вторник"},
  {key: "wednesday", label: "Среда"},
  {key: "thursday", label: "Четверг"},
  {key: "friday", label: "Пятница"},
  {key: "saturday", label: "Суббота"},
  {key: "sunday", label: "Воскресенье"},
] as const;
