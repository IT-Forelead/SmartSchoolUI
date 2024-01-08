import { SVGProps } from "react";

export function SolarAlarmBroken(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      >
        <path
          strokeLinejoin="round"
          d="M12 9v4l2.5 2.5m-11-11l4-2.5m13 2.5l-4-2.5"
        ></path>
        <path d="M7.5 5.204A9 9 0 1 1 4.204 8.5"></path>
      </g>
    </svg>
  );
}
