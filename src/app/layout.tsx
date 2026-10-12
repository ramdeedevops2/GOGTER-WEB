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
   * The mark alone, in brand red, on nothing.
   *
   * This pointed at /gogter.png, the 954x480 lockup. A favicon slot is
   * square, so the browser squashed 2:1 into 1:1 and the mark rendered
   * stretched. Padding it into a square fixed the proportions but left
   * it filling barely 40% of the height on a pale slab, which read as a
   * short, flat panel next to the rounded icons other tabs carry.
   *
   * So: no background at all. The mark is drawn at 96% of the width on a
   * transparent canvas, which is as large as a 2:1 shape goes in a square
   * without cropping, and the red sits on whatever the browser's tab
   * strip happens to be — checked against both a light and a dark one.
   *
   * apple-icon is the exception. iOS composites a home-screen icon onto
   * black rather than honouring transparency, so that one keeps a solid
   * white background to leave the mark red rather than inverted.
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
