import type { TadaDocumentNode } from "gql.tada";
import { request } from "graphql-request";

export async function fetchGraphQL<ResponseType, VariablesType>(
  apiUrl: string,
  query: TadaDocumentNode<ResponseType, VariablesType, unknown>,
  variables?: VariablesType
): Promise<ResponseType> {
  try {
    const response = await request(apiUrl, query, variables ?? {});
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
