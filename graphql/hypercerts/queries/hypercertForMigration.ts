/*
================================================================================
================================================================================
================================================================================
Commented out code because it uses the old schemas
TODO: Update it when the schemas are finalized.
================================================================================
================================================================================
================================================================================
*/

// import { AppCertifiedHypercertRecord } from "climateai-sdk/lex-api";
// import { fetchFullHypercertById } from "./fullHypercertById";

// export const fetchHypercertForMigration = async (hypercertId: string) => {
//   const response = await fetchFullHypercertById(hypercertId);

//   const work = response.metadata.work;
//   if (!work.to || !work.from) {
//     throw new Error("Work timeframe not found.");
//   }

//   const evidences = response.attestations.map((attestation) => {
//     return {
//       $type: "app.certified.hypercert.record#evidence",
//       uri: attestation.data.sources[0].src,
//       title: attestation.data.title,
//     } satisfies AppCertifiedHypercertRecord.Evidence;
//   });

//   const imageUrl =
//     "https://bumicerts.vercel.app/api/hypercerts/image/" + hypercertId;

//   const record: Omit<AppCertifiedHypercertRecord.Record, "image"> = {
//     $type: "app.certified.hypercert.record",
//     title: response.metadata.name,
//     hypercertID: hypercertId,
//     description: response.metadata.description,
//     createdAt: response.creationBlockTimestamp,
//     workScope: work.scope[0],
//     workTimeframeFrom: work.from,
//     workTimeFrameTo: work.to,
//     evidence: evidences,
//     contributors: response.metadata.contributors,
//     rights: undefined,
//     location: undefined,
//   };

//   return {
//     record,
//     imageUrl,
//   };
// };
