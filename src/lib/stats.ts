import moment from "moment";
import axios from "@/services/axios";
import { StatsDaily } from "@/models/common.interface";

const getStats = async (
  type: "sms" | "teachers" | "students",
): Promise<StatsDaily[]> => {
  const counts: StatsDaily[] = [];

  for (let i = 6; i >= 0; i--) {
    counts.push({
      date: moment().subtract(i, "days").format("YYYY-MM-DD"),
      count: 0,
    });
  }

  let url = "";

  if (type == "sms") url = "/sms/messages";
  else if (type == "teachers") url = "/teacher";
  else if (type == "students") url = "/student";
  else return [];

  const statsResponse = (
    await axios.get<StatsDaily[]>(
      `${url}/stats/${counts[0].date}/${counts[6].date}`,
    )
  ).data;

  statsResponse.forEach((stat: StatsDaily) => {
    const index = counts.findIndex((c) => c.date == stat.date);
    counts[index].count = stat.count;
  });

  return counts;
};

export const getSmsStats = async () => await getStats("sms");
export const getStudentStats = async () => await getStats("students");
export const getTeacherStats = async () => await getStats("teachers");
