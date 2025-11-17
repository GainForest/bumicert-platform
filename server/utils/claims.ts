import { Ecocert } from "@/types/ecocert";
import { OrganizationWithClaims } from "../routers/atproto/hypercerts/claim/getAllAcrossOrgs";
import getBlobUrl from "@/lib/atproto/getBlobUrl";

export const getEcocertsFromClaims = (
  claimsWithOrgInfo: OrganizationWithClaims[]
): Ecocert[] => {
  const ecocerts: Ecocert[] = [];
  for (const claimWithOrgInfo of claimsWithOrgInfo) {
    const logo = claimWithOrgInfo.organizationInfo.logo;
    const logoUrl =
      logo ? getBlobUrl(claimWithOrgInfo.repo.did, logo.image) : null;
    for (const claim of claimWithOrgInfo.claims) {
      ecocerts.push({
        repo: {
          did: claimWithOrgInfo.repo.did,
        },
        organizationInfo: {
          name: claimWithOrgInfo.organizationInfo.displayName,
          logoUrl: logoUrl,
        },
        claim: claim,
      });
    }
  }
  return ecocerts;
};
