import { tryCatch } from "@/lib/tryCatch";
import { fetchHypercertsGraphQL, graphql } from "..";

const fullHypercertByHypercertIdQuery = graphql(`
  query GetFullHypercertsByHypercertId($hypercert_id: String!) {
    hypercerts(where: { hypercert_id: { eq: $hypercert_id } }) {
      data {
        units
        uri
        creation_block_timestamp
        creator_address
        contract {
          chain_id
        }
        metadata {
          name
          description
          work_scope
          work_timeframe_from
          work_timeframe_to
          contributors
        }
        orders {
          totalUnitsForSale
          data {
            id
            price
            chainId
            pricePerPercentInToken
            pricePerPercentInUSD
            currency
            invalidated
            itemIds
            createdAt
          }
        }
        attestations {
          data {
            eas_schema {
              chain_id
              schema
              uid
            }
            attester
            creation_block_timestamp
            data
            schema_uid
            uid
          }
        }
        sales {
          data {
            amounts
            buyer
            currency
            currency_amount
            creation_block_timestamp
            transaction_hash
          }
        }
      }
    }
  }
`);

type AttestationDataResponse = {
  title: string;
  chain_id: string;
  token_id: string;
  description: string;
  contract_address: string;
  sources: string[];
};

type AttestationData = Omit<AttestationDataResponse, "sources"> & {
  sources: {
    type: string;
    src: string;
    description?: string;
  }[];
};

export type EcocertAttestation = {
  uid: string;
  schemaUid: string;
  data: AttestationData;
  attester: string;
  creationBlockTimestamp: string;
};

export type FullHypercert = {
  hypercertId: string;

  totalUnits: string;
  unitsForSale?: string;
  uri?: string;
  creationBlockTimestamp: string;
  creatorAddress: string;
  chainId: string;

  metadata: {
    name: string;
    description: string;
    work: {
      scope: string[];
      from?: string;
      to?: string;
    };
    contributors: string[];
  };
  orders: {
    id: string;
    price: string;
    pricePerPercentInToken: number;
    pricePerPercentInUSD: number;
    currency: string;
    invalidated: boolean;
    itemIds: string[];
    createdAt: number;
  }[];
  attestations: EcocertAttestation[];
  sales: {
    unitsBought: string;
    buyer: string;
    currency: string;
    currencyAmount: string;
    creationBlockTimestamp: string;
    transactionHash: string;
  }[];
};

export const fetchFullHypercertById = async (
  hypercertId: string
): Promise<FullHypercert> => {
  const [response, error] = await tryCatch(
    fetchHypercertsGraphQL(fullHypercertByHypercertIdQuery, {
      hypercert_id: hypercertId,
    })
  );
  if (error) {
    throw error;
  }

  const hypercert = response.hypercerts.data
    ? response.hypercerts.data[0]
    : null;
  if (!hypercert) throw new Error("Hypercert not found");

  const metadata = hypercert.metadata;
  const chainId =
    typeof hypercert.contract?.chain_id === "string"
      ? hypercert.contract.chain_id
      : "1";

  // Orders
  const orders = hypercert.orders?.data ?? [];
  const parsedOrders = orders
    .map((order) => {
      if (order.id === null) return null;
      return {
        id: order.id,
        price: order.price,
        pricePerPercentInToken: Number(order.pricePerPercentInToken),
        pricePerPercentInUSD: Number(order.pricePerPercentInUSD),
        currency: order.currency,
        invalidated: order.invalidated,
        itemIds: order.itemIds,
        createdAt: order.createdAt,
      };
    })
    .filter((order) => order !== null);

  // Sales
  const sales = hypercert.sales?.data ?? [];
  const parsedSales = sales.map((sale) => {
    return {
      unitsBought: sale.amounts ? (sale.amounts as string[]).at(0) ?? "0" : "0",
      buyer: sale.buyer,
      currency: sale.currency,
      currencyAmount: sale.currency_amount as string,
      creationBlockTimestamp: sale.creation_block_timestamp as string,
      transactionHash: sale.transaction_hash,
    };
  });

  // Attestations
  const attestations = hypercert.attestations?.data ?? [];
  const parsedAttestations = attestations
    .map((attestation) => {
      if (
        attestation.eas_schema.uid !==
        "0x48e3e1be1e08084b408a7035ac889f2a840b440bbf10758d14fb722831a200c3"
      )
        return null;
      if (
        attestation.uid === null ||
        attestation.schema_uid === null ||
        attestation.attester === null
      )
        return null;
      const data = attestation.data as AttestationDataResponse;
      const parsedData: AttestationData = {
        ...data,
        sources: data.sources.map((source) => JSON.parse(source)) as {
          type: string;
          src: string;
          description?: string;
        }[],
      };
      return {
        uid: attestation.uid,
        schemaUid: attestation.schema_uid,
        data: parsedData,
        attester: attestation.attester,
        creationBlockTimestamp: attestation.creation_block_timestamp as string,
      };
    })
    .filter((attestation) => attestation !== null);

  const fullHypercert = {
    hypercertId,
    totalUnits: hypercert.units as string,
    unitsForSale: hypercert.orders?.totalUnitsForSale as string | undefined,
    uri: hypercert.uri ?? undefined,
    creationBlockTimestamp: hypercert.creation_block_timestamp as string,
    creatorAddress: hypercert.creator_address as string,
    chainId,
    metadata: {
      name: metadata?.name ?? "Untitled",
      description: metadata?.description ?? "No description",
      work: {
        scope: metadata?.work_scope ?? [],
        from: metadata?.work_timeframe_from as string | undefined,
        to: metadata?.work_timeframe_to as string | undefined,
      },
      contributors: (metadata?.contributors ?? []).map((contributor) =>
        contributor.toLowerCase()
      ),
    },
    orders: parsedOrders,
    sales: parsedSales,
    attestations: parsedAttestations,
  };
  return fullHypercert;
};
