import { getSiteUrl } from "@/lib/site";

export function getOgImageUrl(): string {
  return `${getSiteUrl()}/og.png`;
}

export const defaultOgImage = {
  url: "/og.png",
  width: 1024,
  height: 1024,
  alt: "CEO Clubhouse",
} as const;
