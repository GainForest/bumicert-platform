import React from "react";
import StepNavigator from "./_components/StepNavigator";
import StepCard from "./_components/StepCard";
import Steps from "./_components/Steps";
import StepFooter from "./_components/StepFooter";
import AuthWrapper from "./_components/AuthWrapper";

const NewEcocertPage = () => {
  return (
    <AuthWrapper>
      <div className="grid grid-cols-[1fr_300px] gap-6">
        <div className="flex flex-col">
          <StepNavigator />
          <div className="w-full mt-4">
            <Steps />
            <StepFooter />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <StepCard />
        </div>
      </div>
    </AuthWrapper>
  );
};

export default NewEcocertPage;
