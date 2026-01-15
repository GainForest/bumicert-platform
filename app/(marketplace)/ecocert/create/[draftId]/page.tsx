import React from "react";
import AuthWrapper from "./_components/AuthWrapper";
import StepFooter from "./_components/StepFooter";
import HeaderContent from "./_components/HeaderContent";
import StoreHydrator from "./_components/StoreHydrator";
import StepBody from "./_components/StepBody";

const getDataByDraftId = async (draftId: string) => {
  if (draftId === "0") {
    return null;
  }
  return null;
};

const CreateEcocertWithDraftIdPage = async ({
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

export default CreateEcocertWithDraftIdPage;
