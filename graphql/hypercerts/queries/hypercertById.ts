import { graphql } from "@/graphql/hypercerts";
import { tryCatch } from "@/lib/tryCatch";
import { fetchHypercertsGraphQL } from "@/graphql/hypercerts";
import { HypercertFragment } from "@/graphql/hypercerts/fragments/Hypercert";
import { readFragment } from "gql.tada";

export const ALL_HYPERCERT_IDS = [
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-31305977756726338638630463883722675453952",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-31646260123647277102093838491154443665408",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-31986542490568215565557213098586211876864",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-32326824857489154029020587706017980088320",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-32667107224410092492483962313449748299776",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-33007389591331030955947336920881516511232",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-33347671958251969419410711528313284722688",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-33687954325172907882874086135745052934144",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-35389366159777600200190959172903893991424",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-42875578232038246396385200536402794643456",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-44917272433563877177165448180993403912192",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-45257554800484815640628822788425172123648",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-46278401901247631031018946610720476758016",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-46618684268168569494482321218152244969472",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-46958966635089507957945695825584013180928",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-47299249002010446421409070433015781392384",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-47639531368931384884872445040447549603840",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-47979813735852323348335819647879317815296",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-49340943203536077202189318077606390661120",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-50361790304298892592579441899901695295488",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-51042355038140769519506191114765231718400",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-51382637405061707982969565722196999929856",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-51722919771982646446432940329628768141312",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-52743766872745461836823064151924072775680",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-53764613973508277227213187974219377410048",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-54104896340429215690676562581651145621504",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-54785461074271092617603311796514682044416",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-55125743441192031081066686403946450255872",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-57507720009638600325310308655968827736064",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-58528567110401415715700432478264132370432",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-59549414211164231106090556300559437004800",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-59889696578085169569553930907991205216256",
  "42220-0x16bA53B74c234C870c61EFC04cD418B8f2865959-63632802614215492667651051589740655542272",
];

const hypercertByHypercertIdQuery = graphql(
  `
    query GetHypercertsByHypercertId($hypercert_id: String!) {
      hypercerts(where: { hypercert_id: { eq: $hypercert_id } }) {
        data {
          ...Hypercert
        }
      }
    }
  `,
  [HypercertFragment]
);

export type Hypercert = {
  hypercertId: string;
  name: string;
  description: string;
  creatorAddress: string;
  creationBlockTimestamp: string;
  chainId: string;
  totalUnits: string;
  totalUnitsForSale?: string;
  lastValidOrder?: {
    pricePerPercentInUSD: string;
    id: string;
  };
  sales: {
    currency: string;
    currencyAmount: string;
    buyer: string;
  }[];
  uniqueBuyersCount: number;
};

export const fetchHypercertById = async (
  hypercertId: string
): Promise<Hypercert> => {
  const [response, error] = await tryCatch(
    fetchHypercertsGraphQL(hypercertByHypercertIdQuery, {
      hypercert_id: hypercertId,
    })
  );
  if (error) {
    throw error;
  }

  const hypercert = response.hypercerts.data
    ? response.hypercerts.data[0]
    : null;
  if (!hypercert) {
    throw new Error("Hypercert not found");
  }

  const hypercertFragment = readFragment(HypercertFragment, hypercert);

  const allValidOrders = hypercertFragment.orders?.data?.filter(
    (order) => order.invalidated === false
  );
  let largestCreatedAt = 0,
    orderIndex: number | undefined = undefined;
  allValidOrders?.forEach((order, i) => {
    if (order.id && order.createdAt > largestCreatedAt) {
      largestCreatedAt = order.createdAt;
      orderIndex = i;
    }
  });

  const lastValidOrder =
    orderIndex !== undefined ? allValidOrders?.[orderIndex] : undefined;

  const sales: Hypercert["sales"] = (hypercertFragment.sales?.data ?? []).map(
    (sale) => ({
      currency: sale.currency,
      currencyAmount: sale.currency_amount as string,
      buyer: sale.buyer,
    })
  );
  const uniqueBuyers = new Set(sales.map((sale) => sale.buyer as string) ?? []);

  return {
    hypercertId,
    name: hypercertFragment.metadata?.name ?? "Untitled",
    description: hypercertFragment.metadata?.description ?? "No description",
    creatorAddress: hypercertFragment.creator_address as string,
    creationBlockTimestamp:
      hypercertFragment.creation_block_timestamp as string,
    chainId: hypercertFragment.contract?.chain_id as string,
    totalUnits: hypercertFragment.units as string,
    totalUnitsForSale: hypercertFragment.orders?.totalUnitsForSale as
      | string
      | undefined,
    lastValidOrder: lastValidOrder
      ? { ...lastValidOrder, id: lastValidOrder.id ?? "" }
      : undefined,
    uniqueBuyersCount: uniqueBuyers.size,
    sales,
  };
};
