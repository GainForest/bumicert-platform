import React from "react";
import AuthWrapper from "./_components/AuthWrapper";
import StepHeader from "./_components/StepHeader";
import Steps from "./_components/Steps";
import StepFooter from "./_components/StepFooter";
import StepCard from "./_components/StepCard";
import HeaderContent from "./_components/HeaderContent";
import { Button } from "@/components/ui/button";
import StoreHydrator from "./_components/StoreHydrator";

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
        <div className="grid grid-cols-[1fr_300px] gap-6">
          <div className="flex flex-col">
            <StepHeader />
            <div className="w-full mt-8">
              <Steps />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <StepCard />
          </div>
        </div>
      </StoreHydrator>
    </AuthWrapper>
  );
};

export default CreateEcocertWithDraftIdPage;
