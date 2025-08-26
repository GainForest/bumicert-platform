import { graphql } from "@/graphql/hypercerts";

export const HypercertFragment = graphql(`
  fragment Hypercert on Hypercert {
    creation_block_timestamp
    units
    creator_address
    contract {
      chain_id
    }
    metadata {
      name
      description
    }
    orders {
      totalUnitsForSale
      data {
        orderNonce
        id
        invalidated
        pricePerPercentInUSD
        createdAt
      }
    }
    sales {
      data {
        buyer
        currency
        currency_amount
      }
    }
    hypercert_id
  }
`);
