import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Instrument_Serif,
  Cormorant_Garamond,
  Lisu_Bosa,
  Baskervville,
} from "next/font/google";
import "./globals.css";
import PrivyProvider from "@/components/providers/PrivyProvider";
import { NavbarContextProvider } from "@/components/global/Navbar/context";
import NavbarLayout from "@/components/global/Navbar/NavbarLayout";
import { ModalProvider } from "@/components/ui/modal/context";
import ChainSwitchProvider from "@/components/providers/ChainSwitchProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { PriceFeedProvider } from "@/components/providers/PriceFeedProvider";
import { ThemeProvider } from "next-themes";
import HypercertExchangeClientProvider from "@/components/providers/HypercertExchangeClientProvider";
import { TrpcProvider } from "@/components/providers/TrpcProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lisuBosa = Lisu_Bosa({
  variable: "--font-lisu-bosa",
  subsets: ["latin"],
  weight: ["400"],
});

const baskerville = Baskervville({
  variable: "--font-baskerville",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bumicerts",
  description: "Fund impactful regenerative projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${cormorantGaramond.variable} ${lisuBosa.variable} ${baskerville.variable} antialiased h-screen`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <NuqsAdapter>
            {/* <PrivyProvider> */}
            <TrpcProvider>
              <ModalProvider>
                {/* <PriceFeedProvider> */}
                {/* <ChainSwitchProvider> */}
                {/* <HypercertExchangeClientProvider> */}
                {children}
                {/* </HypercertExchangeClientProvider> */}
                {/* </ChainSwitchProvider> */}
                {/* </PriceFeedProvider> */}
              </ModalProvider>
            </TrpcProvider>
            {/* </PrivyProvider> */}
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
