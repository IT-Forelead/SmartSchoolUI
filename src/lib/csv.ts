import { stringify as csvStringify } from "csv-stringify/sync";
import { Visit, VisitFilter, VisitResponse } from "@/models/common.interface";
import axios from "@/services/axios";

export const downloadCsv = async (filter: VisitFilter) => {
  const response = (await axios.post<VisitResponse>("/visit/history", filter))
    .data;
  const maxVisits = response.perPage * response.totalPages;

  const allVisitsResponse = (
    await axios.post<VisitResponse>("/visit/history", {
      ...filter,
      page: 1,
      perPage: maxVisits,
    })
  ).data;

  const visits = allVisitsResponse.visits.map((visit: Visit) => {
    return {
      "Full Name": visit.fullName,
      Group: visit.groupLevel
        ? `${visit.groupLevel}-${visit.groupName}`
        : "Teacher",
      "Visit Time": visit.createdAt,
      "Visit Type": visit.visitType,
      "Picture Link": visit.assetId
        ? process.env.NEXT_PUBLIC_API_URI + "/asset/view/" + visit.assetId
        : "",
    };
  });
  const csvFile = new Blob([csvStringify(visits, { header: true })], {
    type: "text/csv",
  });
  const csvURL = window.URL.createObjectURL(csvFile);
  const tempLink = document.createElement("a");
  tempLink.href = csvURL;
  tempLink.setAttribute("download", "visits.csv");
  tempLink.click();
};
