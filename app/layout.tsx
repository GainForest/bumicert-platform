import type { Metadata } from "next";
import { Inter, EB_Garamond } from "next/font/google";
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
import HotjarProvider from "@/components/providers/HotjarProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://bumicerts.com"
  ),
  title: {
    default: "Bumicerts - Fund Impactful Regenerative Projects",
    template: "%s | Bumicerts",
  },
  description:
    "Fund impactful regenerative projects and support climate action. Discover verified environmental initiatives, purchase digital certificates, and contribute to a sustainable future.",
  keywords: [
    "bumicerts",
    "regenerative projects",
    "climate action",
    "environmental impact",
    "carbon credits",
    "sustainability",
    "ecological restoration",
    "green funding",
  ],
  authors: [{ name: "Bumicerts" }],
  creator: "Bumicerts",
  publisher: "Bumicerts",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Bumicerts",
    title: "Bumicerts - Fund Impactful Regenerative Projects",
    description:
      "Fund impactful regenerative projects and support climate action. Discover verified environmental initiatives and contribute to a sustainable future.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bumicerts - Fund Impactful Regenerative Projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bumicerts - Fund Impactful Regenerative Projects",
    description:
      "Fund impactful regenerative projects and support climate action. Discover verified environmental initiatives and contribute to a sustainable future.",
    images: ["/twitter-image.png"],
    creator: "@bumicerts",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when you have them
    // google: "your-google-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${garamond.variable} antialiased h-screen`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <HotjarProvider>
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
          </HotjarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
