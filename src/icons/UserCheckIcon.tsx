import { SVGProps } from "react";

export function SolarUserCheckBroken(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="6" r="4"></circle>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m17 10.3l1.333 1.2L21 8.5"
        ></path>
        <path
          strokeLinecap="round"
          d="M18.997 18c.003-.164.003-.331.003-.5c0-2.485-3.582-4.5-8-4.5s-8 2.015-8 4.5S3 22 11 22c2.231 0 3.84-.157 5-.437"
        ></path>
      </g>
    </svg>
  );
}
