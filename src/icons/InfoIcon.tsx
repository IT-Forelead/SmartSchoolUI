import { SVGProps } from "react";

export function SolarInfoCircleBroken(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><g fill="none"><path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M12 17v-6"></path><circle cx="1" cy="1" r="1" fill="currentColor" transform="matrix(1 0 0 -1 11 9)"></circle><path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M7 3.338A9.954 9.954 0 0 1 12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12c0-1.821.487-3.53 1.338-5"></path></g></svg>
  )
}