"use client";

import moment from "moment";
import ReactApexChart from "react-apexcharts";
import { SolarUsersGroupRoundedBroken } from "@/icons/TeacherIcon";

export default function TeacherVisitsChart() {
  const series = [
    {
      name: "O`qituvchilar",
      data: [60, 56, 51, 49, 57, 61, 56],
    },
  ];

  const options = {
    chart: {
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: "60%",
        distributed: true,
        dataLabels: {
          position: "top",
        },
        colors: {
          ranges: [
            {
              from: 0,
              to: 24,
              color: "#6b7280",
            },
            {
              from: 25,
              to: 34,
              color: "#0e4429",
            },
            {
              from: 35,
              to: 44,
              color: "#006d32",
            },
            {
              from: 45,
              to: 54,
              color: "#26a641",
            },
            {
              from: 55,
              to: 2000,
              color: "#39d353",
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: "14px",
        colors: ["#304758"],
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: [
        "2023-11-27",
        "2023-11-28",
        "2023-11-29",
        "2023-11-30",
        "2023-12-01",
        "2023-12-02",
        "2023-12-03",
      ],
      labels: {
        style: {
          fontSize: "12px",
          colors: [
            "#8e8da4",
            "#8e8da4",
            "#8e8da4",
            "#8e8da4",
            "#8e8da4",
            "#8e8da4",
            "#8e8da4",
            "#8e8da4",
            "#8e8da4",
            "#8e8da4",
            "#8e8da4",
            "#8e8da4",
          ],
        },
        formatter: function (val: string) {
          return moment(val).format("D-MMMM");
        },
      },
      tooltip: {
        enabled: true,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
      },
    },
    fill: {
      opacity: 1,
    },
    grid: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val + " ta tashrif";
        },
      },
    },
  };

  return (
    <div className="col-span-3 bg-white rounded-lg border">
      <div className="flex items-center justify-between p-5">
        <div>
          <div className="text-lg font-bold">
            O`qituvchilar tashriflari statistikasi
          </div>
          <div className="text-sm">
            Bir haftalik o`qituvchilar tashriflari statistikasi
          </div>
        </div>
        <div className="rounded-xl p-3 bg-green-500 flex items-center justify-center">
          <SolarUsersGroupRoundedBroken className="w-8 h-8 text-white" />
        </div>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={300}
      />
    </div>
  );
}
