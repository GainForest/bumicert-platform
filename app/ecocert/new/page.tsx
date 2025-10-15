import Container from "@/components/ui/container";
import React from "react";
import StepNavigator from "./_components/StepNavigator";
import StepCard from "./_components/StepCard";
import Steps from "./_components/Steps";

const NewEcocertPage = () => {
  return (
    <Container>
      <div className="grid grid-cols-[1fr_300px] gap-6">
        <div className="flex flex-col">
          <StepNavigator />
          <div className="w-full mt-4">
            <Steps />
          </div>
        </div>
        <StepCard />
      </div>
    </Container>
  );
};

export default NewEcocertPage;
