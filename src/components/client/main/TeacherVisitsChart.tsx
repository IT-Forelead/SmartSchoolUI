"use client";

import moment from "moment";
import ReactApexChart from "react-apexcharts";
import { SolarUsersGroupRoundedBroken } from "@/icons/TeacherIcon";
import { getTeacherStats } from "@/lib/stats";

export default async function TeacherVisitsChart() {
  const stats = await getTeacherStats();

  const series = [
    {
      name: "O`qituvchilar",
      data: stats.map((s) => s.count),
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
      categories: stats.map((s) => s.date),
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
    <div className="col-span-3 rounded-lg border bg-white dark:border-slate-600 dark:bg-slate-900">
      <div className="flex items-center justify-between p-5">
        <div>
          <div className="text-lg font-bold">
            O`qituvchilar tashriflari statistikasi
          </div>
          <div className="text-sm">
            Bir haftalik o`qituvchilar tashriflari statistikasi
          </div>
        </div>
        <div className="flex items-center justify-center rounded-xl bg-green-500 p-3">
          <SolarUsersGroupRoundedBroken className="h-8 w-8 text-white" />
        </div>
      </div>
      <ReactApexChart
        className="dark:[&_div]:border-slate-600 dark:[&_div]:bg-slate-900 dark:[&_div]:text-slate-200 dark:[&_div]:shadow-none dark:[&_div_.apexcharts-tooltip-title]:border-slate-600 dark:[&_div_.apexcharts-tooltip-title]:bg-slate-900 dark:[&_div_.apexcharts-tooltip-title]:text-slate-300 dark:[&_svg_text]:fill-slate-200"
        options={options}
        series={series}
        type="bar"
        height={300}
      />
    </div>
  );
}
