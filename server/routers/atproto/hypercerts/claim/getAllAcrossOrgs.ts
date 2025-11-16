import { tryCatch } from "@/lib/tryCatch";
import { publicProcedure } from "@/server/trpc";
import { getReadAgent } from "@/server/utils/agent";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  getOrganizationInfo,
  getOrganizationInfoPure,
} from "../../gainforest/organizationInfo/get";
import { getAllClaimsPure } from "./getAll";
import { Repo } from "@atproto/api/dist/client/types/com/atproto/sync/listRepos";
import {
  AppGainforestOrganizationInfo,
  OrgHypercertsClaimClaim,
} from "@/lexicon-api";
import { Ecocert } from "@/types/ecocert";
import { GetRecordResponse } from "@/server/utils/response-types";

export type OrganizationWithClaims = {
  repo: Repo;
  organizationInfo: AppGainforestOrganizationInfo.Record;
  claims: GetRecordResponse<OrgHypercertsClaimClaim.Record>[];
};

const getAllClaimsAcrossOrganizations = publicProcedure.query(async () => {
  const agent = getReadAgent();

  // Get all the repositories
  const [repositoriesListResponse, repositoriesListFetchError] = await tryCatch(
    agent.com.atproto.sync.listRepos({
      limit: 100,
    })
  );
  if (repositoriesListFetchError || repositoriesListResponse.success !== true) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch repositories list",
    });
  }
  const repositoriesList = repositoriesListResponse.data.repos;

  // Filter the repositories that are organizations
  const [organizationRepositories, organizationsFetchError] = await tryCatch(
    Promise.all(
      repositoriesList.map(async (repo) => {
        const [organizationInfoResponse, organizationInfoFetchError] =
          await tryCatch(getOrganizationInfoPure(repo.did));
        if (organizationInfoFetchError) {
          return null;
        }
        return {
          repo: repo,
          organizationInfo: organizationInfoResponse.value,
        };
      })
    )
  );
  if (organizationsFetchError) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch organizations list",
    });
  }
  const validOrganizationRepositories = organizationRepositories.filter(
    (org) => org !== null
  );

  // Get all the claims for the organizations
  const [claims, claimsFetchError] = await tryCatch(
    Promise.all(
      validOrganizationRepositories.map(async (organization) => {
        const [claimsResponse, claimsFetchError] = await tryCatch(
          getAllClaimsPure(organization.repo.did)
        );
        if (claimsFetchError) {
          return null;
        }
        return {
          repo: organization.repo,
          claims: claimsResponse.claims,
          organizationInfo: organization.organizationInfo,
        };
      })
    )
  );
  if (claimsFetchError) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch claims list",
    });
  }

  const validClaims = claims.filter((claim) => claim !== null);
  return validClaims satisfies OrganizationWithClaims[];
});

export default getAllClaimsAcrossOrganizations;
