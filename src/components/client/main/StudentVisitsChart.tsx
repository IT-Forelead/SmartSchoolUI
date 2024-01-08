"use client";

import ReactApexChart from "react-apexcharts";
import moment from "moment";
import { SolarUsersGroupTwoRoundedBroken } from "@/icons/GroupIcon";
import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function StudentVisitsChart() {
  const series = [
    {
      name: "O`quvchilar",
      data: [362, 348, 299, 341, 378, 384, 391],
    },
  ];

  const options = {
    chart: {
      type: "bar",
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
              to: 99,
              color: "#6b7280",
            },
            {
              from: 100,
              to: 199,
              color: "#0e4429",
            },
            {
              from: 200,
              to: 299,
              color: "#006d32",
            },
            {
              from: 300,
              to: 349,
              color: "#26a641",
            },
            {
              from: 350,
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
          <div className="text-lg font-bold">Tashriflar statistikasi</div>
          <div className="text-sm">Bir haftalik tashriflar statistikasi</div>
        </div>
        <div className="rounded-xl p-3 bg-blue-500 flex items-center justify-center">
          <SolarUsersGroupTwoRoundedBroken className="w-8 h-8 text-white" />
        </div>
      </div>
      <ApexChart options={options} series={series} type="bar" height={300} />
    </div>
  );
}
