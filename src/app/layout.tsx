import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Cursor } from "./cursor";
import { Intro } from "./intro";
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
  title: "Gogter — Real people, right around you.",
  description:
    "Leave a heart at a place you love. Meet the person who picks it up. Gogter is for the people already near you.",
  applicationName: "Gogter",
  icons: { icon: "/gogter.png", apple: "/gogter.png" },
  openGraph: {
    title: "Gogter — Real people, right around you.",
    description: "Good chemistry has a way of showing up close to home.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f1e8",
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
        <Intro />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
