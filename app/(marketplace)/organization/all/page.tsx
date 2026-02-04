import Container from "@/components/ui/container";
import { allowedPDSDomains } from "@/config/gainforest-sdk";
import { gainforestSdk } from "@/config/gainforest-sdk.server";
import { tryCatch } from "@/lib/tryCatch";
import { serialize } from "gainforest-sdk/utilities/transform";
import { getBlobUrl } from "gainforest-sdk/utilities/atproto";
import AllOrganizationsClient from "./_components/AllOrganizationsClient";
import HeaderContent from "./_components/HeaderContent";
import { Suspense } from "react";
import { OrgHypercertsDefs } from "gainforest-sdk/lex-api";

type SmallImage = OrgHypercertsDefs.SmallImage;

export type OrganizationWithBumicertCount = {
  did: string;
  displayName: string;
  shortDescription: string;
  logoUrl: string | null;
  coverImageUrl: string | null;
  country: string;
  objectives: string[];
  bumicertCount: number;
  createdAt: string;
};

export type AllOrganizationsPageData = {
  organizations: OrganizationWithBumicertCount[];
};

const AllOrganizationsPage = async () => {
  const apiCaller = gainforestSdk.getServerCaller();
  const [response, error] = await tryCatch(
    apiCaller.hypercerts.claim.activity.getAllAcrossOrgs({
      pdsDomain: allowedPDSDomains[0],
    })
  );

  if (error) {
    console.error("Failed to fetch organizations:", error);
    return (
      <Container>
        <div className="py-12 text-center text-muted-foreground">
          Failed to load organizations. Please try again later.
        </div>
      </Container>
    );
  }

  const getSmallImageUrl = (
    did: string,
    image: unknown
  ): string | null => {
    const smallImage = image as SmallImage | null;
    if (!smallImage?.$type?.includes("smallImage")) return null;
    return getBlobUrl(did, smallImage, allowedPDSDomains[0]);
  };

  const organizations: OrganizationWithBumicertCount[] = response
    .filter((org) => org.organizationInfo.visibility === "Public")
    .map((org) => ({
      did: org.repo.did,
      displayName: org.organizationInfo.displayName,
      shortDescription: org.organizationInfo.shortDescription.text,
      logoUrl: getSmallImageUrl(org.repo.did, org.organizationInfo.logo),
      coverImageUrl: getSmallImageUrl(org.repo.did, org.organizationInfo.coverImage),
      country: org.organizationInfo.country,
      objectives: org.organizationInfo.objectives,
      bumicertCount: org.activities.length,
      createdAt: org.organizationInfo.createdAt,
    }));

  const pageData: AllOrganizationsPageData = { organizations };
  const serializedData = serialize(pageData);

  return (
    <Container>
      <Suspense>
        <HeaderContent />
        <AllOrganizationsClient serializedData={serializedData} />
      </Suspense>
    </Container>
  );
};

export default AllOrganizationsPage;
