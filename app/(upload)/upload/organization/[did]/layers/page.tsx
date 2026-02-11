import Container from "@/components/ui/container";
import { gainforestSdk } from "@/config/gainforest-sdk.server";
import { allowedPDSDomains } from "@/config/gainforest-sdk";
import { tryCatch } from "@/lib/tryCatch";
import { TRPCError } from "@trpc/server";
import { serialize } from "gainforest-sdk/utilities/transform";

import LayersHeaderContent from "./HeaderContent";
import ErrorPage from "@/app/(upload)/upload/organization/[did]/layers/error";
import LayersClient from "@/app/(upload)/upload/organization/[did]/layers/_components/LayersClient";
import type { AllLayersData } from "@/app/(upload)/upload/organization/[did]/layers/_components/LayersClient";

const LayersPage = async ({ params }: { params: Promise<{ did: string }> }) => {
  const { did: encodedDid } = await params;
  const did = decodeURIComponent(encodedDid);

  const serverCaller = gainforestSdk.getServerCaller();
  const [response, error] = await tryCatch(
    serverCaller.gainforest.organization.layer.getAll({
      did,
      pdsDomain: allowedPDSDomains[0],
    })
  );

  let data: AllLayersData = [];

  try {
    if (error) {
      if (error instanceof TRPCError && error.code === "NOT_FOUND") {
        data = [];
      } else if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
        throw new Error("Unable to fetch layers.");
      } else {
        throw new Error("An unknown error occurred.");
      }
    } else {
      data = response || [];
    }
  } catch (error) {
    console.error(
      "Redirecting to error page due to the following error:",
      error
    );
    return <ErrorPage error={error as Error} />;
  }

  const serializedInitialData = serialize(data);

  return (
    <Container>
      <LayersHeaderContent />
      <div className="p-2">
        <LayersClient did={did} serializedInitialData={serializedInitialData} />
      </div>
    </Container>
  );
};

export default LayersPage;
