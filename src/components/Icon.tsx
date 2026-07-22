import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(size: number) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

/* --- Icônes d'interface --- */

export function SearchIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

export function MapPinIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function ClockIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function WalletIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a2 2 0 0 1 2 2v1" />
      <path d="M3 7.5V17a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-3.5" />
      <path d="M20 9.5v4h-4a2 2 0 0 1 0-4h4z" />
    </svg>
  );
}

export function BriefcaseIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5" />
      <path d="M3 12.5h18" />
    </svg>
  );
}

export function BuildingIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16" />
      <path d="M15 9h4a1 1 0 0 1 1 1v11" />
      <path d="M3 21h18" />
      <path d="M8 8h3M8 12h3M8 16h3" />
    </svg>
  );
}

export function UsersIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 6.1" />
      <path d="M17.5 14.3A5.5 5.5 0 0 1 20.5 20" />
    </svg>
  );
}

export function UserIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 18, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function CheckIcon({ size = 18, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="m5 12.5 4.5 4.5L19 7" strokeWidth={2} />
    </svg>
  );
}

export function InboxIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M3 13h4l1.5 2.5h7L17 13h4" />
      <path d="M4.5 6h15L21 13v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4z" />
    </svg>
  );
}

export function GlobeIcon({ size = 18, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.4 2.5 2.4 15 0 18M12 3c-2.4 2.5-2.4 15 0 18" strokeWidth={1.3} />
    </svg>
  );
}

export function MenuIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CalendarIcon({ size = 18, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  );
}

export function FileIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5a1.5 1.5 0 0 1 1-1.5z" />
      <path d="M14 3.5V8h4" />
      <path d="M9 13h6M9 16.5h6" />
    </svg>
  );
}

export function UploadIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M12 15V4" />
      <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
      <path d="M4.5 15v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

export function DownloadIcon({ size = 18, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M12 4v11" />
      <path d="m7.5 11.5 4.5 4.5 4.5-4.5" />
      <path d="M4.5 17v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

/* --- Icônes de catégories (indexées par slug) --- */

const CATEGORY: Record<string, (p: IconProps) => React.ReactElement> = {
  "business-development": ({ size = 24, ...p }) => (
    <svg {...base(size)} {...p}>
      <path d="M4 19h16" />
      <path d="M6 19V9m5 10V5m5 14v-6" />
      <path d="m5 11 4-4 4 3 5-6" />
    </svg>
  ),
  tech: ({ size = 24, ...p }) => (
    <svg {...base(size)} {...p}>
      <path d="m9 8-4 4 4 4" />
      <path d="m15 8 4 4-4 4" />
    </svg>
  ),
  "customer-service": ({ size = 24, ...p }) => (
    <svg {...base(size)} {...p}>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <path d="M4 13a2 2 0 0 1 2 2v2a2 2 0 0 1-4 0v-2a2 2 0 0 1 2-2z" />
      <path d="M20 13a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1a5 5 0 0 1-5 4" />
    </svg>
  ),
  finance: ({ size = 24, ...p }) => (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v10M9.5 9.5c0-1.1 1.1-2 2.5-2s2.5.9 2.5 2-1.1 1.6-2.5 1.6-2.5.7-2.5 1.8 1.1 2 2.5 2 2.5-.9 2.5-2" />
    </svg>
  ),
  healthcare: ({ size = 24, ...p }) => (
    <svg {...base(size)} {...p}>
      <path d="M4 5v5a4 4 0 0 0 8 0V5" />
      <path d="M4 5H2.5M4 5h1.5M12 5h-1.5M12 5h1.5" />
      <path d="M8 14v1a5 5 0 0 0 10 0v-1" />
      <circle cx="18" cy="12" r="2" />
    </svg>
  ),
  "human-resources": ({ size = 24, ...p }) => (
    <svg {...base(size)} {...p}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 6.1" />
      <path d="M17.5 14.3A5.5 5.5 0 0 1 20.5 20" />
    </svg>
  ),
  marketing: ({ size = 24, ...p }) => (
    <svg {...base(size)} {...p}>
      <path d="M4 10v4a1 1 0 0 0 1 1h2l1.5 4h2l-1-4 8 3.5V6L9.5 9.5H5a1 1 0 0 0-1 1z" />
      <path d="M18 9a3 3 0 0 1 0 6" />
    </svg>
  ),
  education: ({ size = 24, ...p }) => (
    <svg {...base(size)} {...p}>
      <path d="M2.5 9 12 5l9.5 4L12 13 2.5 9z" />
      <path d="M6 11v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4" />
      <path d="M21.5 9v4" />
    </svg>
  ),
  agriculture: ({ size = 24, ...p }) => (
    <svg {...base(size)} {...p}>
      <path d="M12 21v-8" />
      <path d="M12 13c0-3 2-6 5.5-6.5C17 10 15 13 12 13z" />
      <path d="M12 15c0-3-2-6-5.5-6.5C7 12 9 15 12 15z" />
    </svg>
  ),
  logistics: ({ size = 24, ...p }) => (
    <svg {...base(size)} {...p}>
      <path d="M2.5 7h11v9h-11z" />
      <path d="M13.5 10h4l3 3v3h-7z" />
      <circle cx="6.5" cy="18" r="1.8" />
      <circle cx="17.5" cy="18" r="1.8" />
    </svg>
  ),
};

export function CategoryIcon({
  slug,
  size = 24,
  ...p
}: IconProps & { slug: string }) {
  const render = CATEGORY[slug] ?? BriefcaseIcon;
  return render({ size, ...p });
}
