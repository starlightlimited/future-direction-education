import Link from "next/link";
import { site } from "@/lib/content";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 min-w-0">
      <span className="relative grid h-10 w-10 shrink-0 place-items-center">
        <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden>
          <circle cx="20" cy="12" r="5" fill="#6D5CFF" />
          <circle cx="11" cy="26" r="4.2" fill="#41E295" />
          <circle cx="29" cy="26" r="4.2" fill="#5B4DFF" />
          <path
            d="M17.5 15.2 13.6 22.8M22.5 15.2 26.4 22.8M14.8 26h10.4"
            stroke={light ? "#fff" : "#6D5CFF"}
            strokeWidth="1.6"
            fill="none"
          />
        </svg>
      </span>
      <span className="min-w-0">
        <span
          className={`block truncate text-[15px] font-semibold leading-tight ${
            light ? "text-white" : "text-navy"
          }`}
        >
          {site.nameZh}
        </span>
      </span>
    </Link>
  );
}
