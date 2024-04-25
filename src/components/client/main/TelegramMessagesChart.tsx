"use client";

import { format, subDays } from "date-fns";
import ReactApexChart from "react-apexcharts";
import { SolarChatRoundLineBroken } from "@/icons/ChatIcon";
import { useTelegramMessagesStatsByRange } from "@/hooks/useTelegramMessages";
import { StatsDaily } from "@/models/common.interface";

const today = new Date();
const startDate = subDays(today, 6);

export default function TelegramMessagesChart() {
  const { data: stats } = useTelegramMessagesStatsByRange({
    from: format(startDate, "yyyy-MM-dd"),
    to: format(today, "yyyy-MM-dd"),
  });
  const counts: StatsDaily[] = [];

  for (let i = 6; i >= 0; i--) {
    counts.push({
      date: format(subDays(today, i), "yyyy-MM-dd"),
      count: 0,
    });
  }

  stats?.data.forEach((stat: StatsDaily) => {
    const index = counts.findIndex((c) => c.date == stat.date);
    counts[index].count = stat.count;
  });

  const series = [
    {
      name: "Yuborilgan Telegram xabarlar",
      data: counts.map((s) => s.count) ?? [],
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
      categories: counts.map((s) => s.date),
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
        formatter: (val: number): string => format(val, "d-MMM"),
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
    <div className="col-span-2 rounded-lg border bg-white dark:border-slate-600 dark:bg-slate-900">
      <div className="flex items-center justify-between p-5">
        <div>
          <div className="text-lg font-bold">
            Telegram xabarlar statistikasi
          </div>
          <div className="text-sm">
            Bir haftalik Telegram xabarlar statistikasi
          </div>
        </div>
        <div className="flex items-center justify-center rounded-xl bg-yellow-500 p-3">
          <SolarChatRoundLineBroken className="h-8 w-8 text-white" />
        </div>
      </div>
      <ReactApexChart
        className="dark:[&_div]:border-slate-600 dark:[&_div]:bg-slate-900 dark:[&_div]:text-slate-200 dark:[&_div]:shadow-none dark:[&_div_.apexcharts-tooltip-title]:border-slate-600 dark:[&_div_.apexcharts-tooltip-title]:bg-slate-900 dark:[&_div_.apexcharts-tooltip-title]:text-slate-300 dark:[&_svg_text]:fill-slate-200"
        options={options}
        series={series}
        type="bar"
        height={250}
      />
    </div>
  );
}
