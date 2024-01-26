import { format } from "date-fns";
import uz from "date-fns/locale/uz";

export const humanize = (date: Date): string => {
  return format(date, "d-MMMM, yyyy", { locale: uz });
};

export const iso8601 = (date: Date): string => {
  return format(date, "YYYY-MM-DD");
};
