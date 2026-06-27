/**
 * TT Fors lokal einbinden, sobald .woff2-Dateien in app/fonts/ liegen:
 *
 * import localFont from "next/font/local";
 *
 * export const ttFors = localFont({
 *   src: [
 *     { path: "./TTFors-Regular.woff2", weight: "400" },
 *     { path: "./TTFors-Medium.woff2", weight: "500" },
 *     { path: "./TTFors-DemiBold.woff2", weight: "600" },
 *     { path: "./TTFors-Bold.woff2", weight: "700" },
 *     { path: "./TTFors-ExtraBold.woff2", weight: "800" },
 *   ],
 *   variable: "--font-tt-fors",
 *   fallback: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
 * });
 */

export {};
