import MyOrganizationPageClient from "./_components/MyOrganizationPageClient";
import { getSessionFromRequest } from "@/server/session";
import { redirect } from "next/navigation";

export default async function MyOrganizationPage() {
  try {
    const session = await getSessionFromRequest("climateai.org");
    if (session && session.did) {
      redirect(`/organization/${session.did}`);
    }
  } catch {}
  return <MyOrganizationPageClient />;
}
