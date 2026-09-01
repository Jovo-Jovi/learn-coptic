import { cache } from "react";
import { PrayersFile, type Prayer } from "@/data/schema";
import raw from "@/data/json/prayers.json";

export const getPrayers = cache((): Prayer[] => PrayersFile.parse(raw).prayers);

export function getPrayerById(id: string): Prayer | undefined {
  return getPrayers().find((prayer) => prayer.id === id);
}

export const OCCASION_AR: Record<Prayer["occasion"][number], string> = {
  daily: "يومي",
  agpeya: "الأجبية",
  liturgy: "القداس",
  vespers: "عشية",
  matins: "باكر",
  feast: "عيد",
  fasting: "صوم",
  hymn: "لحن",
};
