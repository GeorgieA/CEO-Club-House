import type { SVGProps } from "react";

function base(props: SVGProps<SVGSVGElement>) {
  return {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function ThumbUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}

export function ThumbDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  );
}

export function CommentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function ShareIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
    </svg>
  );
}

export function LinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

// Marken-Icons (gefüllt, Simple-Icons-Pfade). Eigene Basis mit fill.
function brandBase(props: SVGProps<SVGSVGElement>) {
  return {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true,
    ...props,
  };
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...brandBase(props)}>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...brandBase(props)}>
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.6l5.24 6.93ZM17.6 20.64h2.04L6.49 3.24H4.3Z" />
    </svg>
  );
}

export function RedditIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...brandBase(props)}>
      <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm6.07 12.4a1.55 1.55 0 0 1-.94 1.43c.02.16.03.32.03.49 0 2.5-2.9 4.52-6.49 4.52s-6.49-2.02-6.49-4.52c0-.17.01-.34.04-.5a1.55 1.55 0 1 1 1.7-2.53 7.6 7.6 0 0 1 4.13-1.31l.78-3.68a.34.34 0 0 1 .4-.26l2.58.55a1.1 1.1 0 1 1-.15.72l-2.3-.49-.7 3.3a7.58 7.58 0 0 1 4.08 1.31 1.55 1.55 0 0 1 2.49 1.25ZM8.67 13.4a1.1 1.1 0 1 0 2.2 0 1.1 1.1 0 0 0-2.2 0Zm6.07 2.92a.34.34 0 0 0-.48-.02c-.53.46-1.42.62-2.26.62-.84 0-1.73-.16-2.26-.62a.34.34 0 1 0-.45.5c.74.65 1.84.8 2.71.8.87 0 1.97-.15 2.71-.8a.34.34 0 0 0 .03-.48Zm-1.5-1.82a1.1 1.1 0 1 0 2.2 0 1.1 1.1 0 0 0-2.2 0Z" />
    </svg>
  );
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...brandBase(props)}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.04 2.2A9.8 9.8 0 0 0 3.7 17.06L2.4 21.8l4.85-1.27a9.78 9.78 0 0 0 4.78 1.22h.01a9.8 9.8 0 0 0 0-19.6Zm5.71 15.5a8.15 8.15 0 0 1-12.3 1.04l-.29-.29-2.88.76.77-2.8-.31-.31a8.13 8.13 0 1 1 15.3 1.6Z" />
    </svg>
  );
}

export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...brandBase(props)}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...brandBase(props)}>
      <path d="M23.95 4.57c.28-1.32-.48-1.84-1.34-1.52L1.32 11.27c-1.45.56-1.43 1.36-.25 1.72l5.5 1.72 12.78-8.05c.6-.4 1.15-.18.7.22l-10.35 9.35-.4 5.65c.56 0 .8-.24 1.1-.53l2.65-2.56 5.5 4.06c1.01.56 1.73.27 1.98-.93l3.58-16.85Z" />
    </svg>
  );
}

export function EmailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}
