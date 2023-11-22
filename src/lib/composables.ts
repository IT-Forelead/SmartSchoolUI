import moment from "moment";
export function dateFormatter(date: moment.MomentInput) {
  if (date) {
    return moment(date).format("DD/MM/YYYY HH:mm:ss");
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
    return 'bg-green-500 hover:bg-green-600'
  }
  return 'bg-white hover:bg-gray-100'
}
