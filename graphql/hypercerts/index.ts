import { initGraphQLTada, TadaDocumentNode } from "gql.tada";
import type { introspection } from "./env.d.ts";
import { fetchGraphQL } from "../";
import { hypercertsGraphqlEndpoint } from "@/config/hypercerts";

export const graphql = initGraphQLTada<{
  introspection: introspection;
}>();

export async function fetchHypercertsGraphQL<ResponseType, VariablesType>(
  query: TadaDocumentNode<ResponseType, VariablesType, unknown>,
  variables?: VariablesType
): Promise<ResponseType> {
  return fetchGraphQL(hypercertsGraphqlEndpoint, query, variables);
}
