import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://bumicerts.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/internal/", "/_next/", "/upload/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
