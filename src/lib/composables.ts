import moment from "moment";
import { Group } from "@/models/common.interface";

export function dateFormatter(date: moment.MomentInput) {
  if (date) {
    return moment(date).format("DD/MM/YYYY HH:mm");
  }
  return;
}

export function translateSMSStatus(status: string) {
  if (status === "Sent") {
    return "Yuborilgan";
  } else if (status === "Delivered") {
    return "Yetkazilgan";
  } else if (status === "NotDelivered") {
    return "Yetkazilmagan";
  } else if (status === "Failed") {
    return "Yuborilmagan";
  }
  return "Noma`lum";
}

export function translateVisitType(type: string) {
  if (type === "come_in") {
    return "Keldi";
  } else if (type === "go_out") {
    return "Ketdi";
  }
  return "Noma`lum";
}

export function translateRoomType(rt: string) {
  if (rt.includes("class_room")) {
    return "sinfxona";
  }
  return "laboratoriya";
}

export const moments = [1, 2, 3, 4, 5, 6];

export const weekdays = [
  "Dushanba",
  "Seshanba",
  "Chorshanba",
  "Payshanba",
  "Juma",
  "Shanba",
];

export const weekdaysThreeLetter = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function translateWeekday(uwd: string) {
  const weekdayMap = new Map();

  for (let i = 0; i < weekdays.length; i++) {
    weekdayMap.set(weekdays[i], weekdaysThreeLetter[i]);
  }
  return weekdayMap.get(uwd);
}

export function translateEnToUzbWeekday(wd: string) {
  const weekdayMap = new Map();

  for (let i = 0; i < weekdays.length; i++) {
    weekdayMap.set(weekdaysThreeLetter[i], weekdays[i]);
  }
  return weekdayMap.get(wd);
}

export function fillColor(studentsCount: number, divide: boolean) {
  if (divide && studentsCount >= 25) {
    return "bg-green-500 dark:bg-green-700 dark:hover:bg-green-600 hover:bg-green-600";
  }
  return "bg-white dark:bg-slate-900 dark:hover:bg-slate-700 hover:bg-gray-100";
}

export function translateGroup(group?: Group) {
  return group?.level + "-" + group?.name;
}

export const documentTypes = ["passport", "birth_certificate"] as const;
export const documentTypesUz = [
  "Passport",
  "Tug'ilganlik haqidagi guvohnoma",
] as const;
export const translateDocumentType = (n: string) => {
  const map = new Map();

  for (let i = 0; i < documentTypes.length; i++) {
    map.set(documentTypes[i], documentTypesUz[i]);
  }

  return map.get(n);
};

export const nationalities = ["uzbek", "russian", "turkmen"] as const;
export const nationalitiesUz = ["o'zbek", "rus", "turkman"] as const;

export const translateNationality = (n: string) => {
  const map = new Map();

  for (let i = 0; i < nationalities.length; i++) {
    map.set(nationalities[i], nationalitiesUz[i]);
  }

  return map.get(n);
};

export const citizenships = ["uzbekistan", "russia"] as const;
export const citizenshipsUz = ["O'zbekiston", "Rossiya"] as const;

export const translateCitizenship = (n: string) => {
  const map = new Map();

  for (let i = 0; i < citizenships.length; i++) {
    map.set(citizenships[i], citizenshipsUz[i]);
  }

  return map.get(n);
};
