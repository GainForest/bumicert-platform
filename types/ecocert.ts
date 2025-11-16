import { OrgHypercertsClaimClaim } from "@/lexicon-api";
import { GetRecordResponse } from "@/server/utils/response-types";

export type Ecocert = {
  repo: {
    did: string;
  };
  organizationInfo: {
    name: string;
  };
  claim: GetRecordResponse<OrgHypercertsClaimClaim.Record>;
};
