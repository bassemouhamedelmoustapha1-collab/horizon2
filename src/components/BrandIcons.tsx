import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export function GoogleIcon({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...p}>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.11A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.26a12 12 0 0 0 0 10.75z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.26 6.63l4.01 3.1C6.22 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  );
}

export function AppleIcon({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M16.37 1c.1 1.03-.3 2.03-.94 2.77-.66.76-1.75 1.36-2.81 1.28-.12-1 .36-2.05 1-2.75.7-.78 1.9-1.36 2.75-1.3zM20.7 17.15c-.5 1.14-.74 1.65-1.38 2.66-.9 1.4-2.16 3.15-3.73 3.16-1.39.02-1.75-.9-3.64-.9-1.88 0-2.28.88-3.66.92-1.56.05-2.75-1.5-3.65-2.9-2.5-3.85-2.76-8.37-1.22-10.78 1.1-1.72 2.83-2.72 4.45-2.72 1.65 0 2.69.9 4.05.9 1.32 0 2.13-.9 4.05-.9 1.44 0 2.97.79 4.06 2.14-3.57 1.96-2.99 6.88.67 8.42z" />
    </svg>
  );
}

export function FacebookIcon({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...p}>
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        fill="#fff"
        d="M15.5 12.5h-2v7h-2.9v-7H9v-2.5h1.6V8.4c0-1.6.8-2.9 3.2-2.9h2.1v2.5h-1.4c-.6 0-.9.3-.9.9v1.1h2.3z"
      />
    </svg>
  );
}

export function LinkedInIcon({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...p}>
      <rect width="24" height="24" rx="5" fill="#0A66C2" />
      <path
        fill="#fff"
        d="M6.94 8.86H4.56v8.58h2.38V8.86zM5.75 5c-.8 0-1.4.6-1.4 1.35 0 .74.6 1.34 1.38 1.34.83 0 1.4-.6 1.4-1.34C7.13 5.6 6.56 5 5.75 5zM19.44 12.7c0-2.28-1.22-3.34-2.85-3.34-1.31 0-1.9.72-2.23 1.22v-1.05h-2.38c.03.68 0 8.58 0 8.58h2.38v-4.79c0-.26.02-.51.1-.7.2-.51.68-1.04 1.47-1.04 1.04 0 1.46.79 1.46 1.95v4.58h2.38v-4.86z"
      />
    </svg>
  );
}
