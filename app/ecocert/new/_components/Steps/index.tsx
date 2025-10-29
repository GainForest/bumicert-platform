"use client";
import React from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import useNewEcocertStore from "../../store";
import Step4 from "./Step4";

const Steps = () => {
  const { currentStepIndex } = useNewEcocertStore();
  return (
    <>
      {currentStepIndex === 0 && <Step1 />}
      {currentStepIndex === 1 && <Step2 />}
      {currentStepIndex === 2 && <Step3 />}
      {currentStepIndex === 3 && <Step4 />}
    </>
  );
};

export default Steps;
