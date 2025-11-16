import { Ecocert } from "@/types/ecocert";
import { OrganizationWithClaims } from "../routers/atproto/hypercerts/claim/getAllAcrossOrgs";

export const getEcocertsFromClaims = (
  claimsWithOrgInfo: OrganizationWithClaims[]
): Ecocert[] => {
  const ecocerts: Ecocert[] = [];
  for (const claimWithOrgInfo of claimsWithOrgInfo) {
    for (const claim of claimWithOrgInfo.claims) {
      ecocerts.push({
        repo: {
          did: claimWithOrgInfo.repo.did,
        },
        organizationInfo: {
          name: claimWithOrgInfo.organizationInfo.displayName,
        },
        claim: claim,
      });
    }
  }
  return ecocerts;
};
