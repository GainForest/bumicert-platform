import React from "react";
import { headers } from "next/headers";
import AuthWrapper from "./_components/AuthWrapper";
import StepFooter from "./_components/StepFooter";
import HeaderContent from "./_components/HeaderContent";
import StoreHydrator from "./_components/StoreHydrator";
import StepBody from "./_components/StepBody";
import { links } from "@/lib/links";
import { BASE_URL } from "@/config/endpoint";

const getDataByDraftId = async (draftId: string) => {
  const draftIdNum = parseInt(draftId, 10);
  if (isNaN(draftIdNum) || draftIdNum === 0) {
    return null;
  }

  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") || "";

  const response = await fetch(
    `${BASE_URL}${links.api.drafts.bumicert.get({ draftIds: [draftIdNum] })}`,
    {
      method: "GET",
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.success && data.drafts?.[0] ? data.drafts[0] : null;
};

const CreateBumicertWithDraftIdPage = async ({
  params,
}: {
  params: Promise<{ draftId: string }>;
}) => {
  const { draftId } = await params;
  const data = await getDataByDraftId(draftId);

  return (
    <AuthWrapper footer={<StepFooter />}>
      <StoreHydrator draftResponse={data}>
        <HeaderContent />
        <StepBody />
      </StoreHydrator>
    </AuthWrapper>
  );
};

export default CreateBumicertWithDraftIdPage;
