"use client";

import moment from "moment";
import ReactApexChart from "react-apexcharts";
import { SolarChatRoundLineBroken } from "@/icons/ChatIcon";
import { getSmsStats } from "@/lib/stats";

export default async function SmsMessagesChart() {
  const stats = await getSmsStats();

  const series = [
    {
      name: "Yuborilgan SMS xabarlar",
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
        borderRadius: 4,
        horizontal: true,
        dataLabels: {
          position: "right",
        },
      },
    },
    dataLabels: {
      enabled: false,
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
      tooltip: {
        enabled: false,
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
        show: true,
        formatter: (val: number): string => moment(val).format("D-MMM"),
      },
    },
    grid: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val + " ta";
        },
      },
    },
  };

  return (
    <div className="col-span-2 bg-white rounded-lg border">
      <div className="flex items-center justify-between p-5">
        <div>
          <div className="text-lg font-bold">SMS xabarlar statistikasi</div>
          <div className="text-sm">Bir haftalik SMS xabarlar statistikasi</div>
        </div>
        <div className="rounded-xl p-3 bg-yellow-500 flex items-center justify-center">
          <SolarChatRoundLineBroken className="w-8 h-8 text-white" />
        </div>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={250}
      />
    </div>
  );
}
