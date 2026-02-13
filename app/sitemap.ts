import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://bumicerts.com";

  // Static routes that should be in the sitemap
  const routes = ["", "/explore", "/organization/all", "/bumicert/create", "/onboarding"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : route === "/onboarding" ? 0.9 : 0.8,
  }));

  // TODO: Add dynamic routes for bumicerts and organizations
  // You can fetch these from your database and add them here
  // Example:
  // const bumicerts = await fetchAllBumicerts()
  // const bumicertRoutes = bumicerts.map((cert) => ({
  //   url: `${baseUrl}/bumicert/${cert.id}`,
  //   lastModified: cert.updatedAt,
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.7,
  // }))

  return routes;
}
