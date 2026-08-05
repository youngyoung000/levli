import type { Metadata } from "next";
import { Host_Grotesk, Instrument_Sans, Inter, JetBrains_Mono, Roboto_Mono } from "next/font/google";
import "./globals.css";

/* tokens.css / landing-tokens.css의 --font-* 변수가 이 next/font 변수를 참조한다 */
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });
const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-host-grotesk",
  display: "swap",
});
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-instrument-sans",
  display: "swap",
});
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Levli — Simulated Crypto Prop Trading",
  description: "Prove your skill in a simulated crypto challenge with clear rules and eligible USDC rewards.",
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${hostGrotesk.variable} ${instrumentSans.variable} ${robotoMono.variable}`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
