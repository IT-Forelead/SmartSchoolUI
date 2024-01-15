import { SvgSpinnersBouncingBall } from "@/icons/LoaderIcon";
import React from "react";

export default function Loader() {
  return (
    <div className="flex h-20 w-full items-center justify-center">
      <SvgSpinnersBouncingBall className="h-7 w-7" />
      Ma`lumotlar yuklanmoqda...
    </div>
  );
}
