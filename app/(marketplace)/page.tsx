import Container from "@/components/ui/container";
import HeaderContent from "./_components/Home/HeaderContent";
import Hero2 from "./_components/Home/Hero2";
import WhatIsBumicert from "./_components/Home/WhatIsBumicert";
import UserOptionCards from "./_components/Home/UserOptionCards";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Discover and fund verified regenerative projects making real environmental impact. Browse bumicerts, explore climate action initiatives, and support sustainable development worldwide.",
  keywords: ["regenerative projects", "climate funding", "environmental certificates", "carbon offset", "sustainability marketplace", "ecological impact", "green investment"],
  openGraph: {
    title: "Bumicerts - Fund Impactful Regenerative Projects",
    description: "Discover and fund verified regenerative projects making real environmental impact. Support climate action and sustainable development worldwide.",
    url: "/",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bumicerts Homepage",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bumicerts - Fund Impactful Regenerative Projects",
    description: "Discover and fund verified regenerative projects making real environmental impact.",
    images: ["/twitter-image.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Bumicerts",
    "description": "Fund impactful regenerative projects and support climate action",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://bumicerts.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_BASE_URL || "https://bumicerts.com"}/explore?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Bumicerts",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL || "https://bumicerts.com"}/logo.png`
      }
    }
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Bumicerts",
    "description": "Platform for funding impactful regenerative projects and supporting climate action",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://bumicerts.com",
    "logo": `${process.env.NEXT_PUBLIC_BASE_URL || "https://bumicerts.com"}/logo.png`,
    "sameAs": []
  };

  return (
    <>
      {/* Add structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      
      <Container className="pb-24">
        <HeaderContent />
        <Hero2 />
        <UserOptionCards />
        <WhatIsBumicert />
      </Container>
    </>
  );
}
