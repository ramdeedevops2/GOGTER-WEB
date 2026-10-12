import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Reveal } from "./reveal";
import "./globals.css";

/*
 * Two faces, doing the two jobs the references split between four.
 *
 * Fraunces carries every display line: it has the warmth of a broadsheet
 * serif and holds up at the sizes this page sets it at, where a grotesque
 * would read as a tech company. Inter handles everything you read rather
 * than look at.
 */
const display = Fraunces({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const ui = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gogter",
  applicationName: "Gogter",
  /*
   * Square icons, not the wordmark.
   *
   * This pointed at /gogter.png, which is 954x480 — the wide G-and-heart
   * lockup. Every favicon slot is square, so the browser squashed a 2:1
   * image into 1:1 and the mark came out visibly stretched.
   *
   * Padding it into a square was not enough either: the mark is 2:1, so
   * it filled barely 40% of the height and sat in a pale band that read
   * as a short, flat logo rather than an icon. So the tile carries the
   * shape instead — solid brand red, rounded like every other icon on a
   * tab strip, with the mark in white across the middle. The tile fills
   * the slot, which is what stops it looking short, and white on red
   * holds up at 16px where the red-on-cream version muddied.
   */
  icons: {
    icon: [
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
  },
  openGraph: {
    title: "Gogter",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${ui.variable}`}>
      <body>
        {/* Adds the class the reveal styles hang off, so nothing is hidden
            on a page whose script never ran. */}
        <Reveal />
        {children}
      </body>
    </html>
  );
}
