import moment from "moment";
export function dateFormatter(date: moment.MomentInput) {
  if (date) {
    return moment(date).format("DD/MM/YYYY HH:mm:ss");
  }
  return
}
