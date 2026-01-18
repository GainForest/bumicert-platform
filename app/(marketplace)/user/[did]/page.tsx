import React from "react";
import { redirect } from "next/navigation";
import { links } from "@/lib/links";

const UserPage = async ({ params }: { params: Promise<{ did: string }> }) => {
  const { did: encodedDid } = await params;
  const did = decodeURIComponent(encodedDid);

  redirect(links.myOrganization(did));

  return null;
};

export default UserPage;
