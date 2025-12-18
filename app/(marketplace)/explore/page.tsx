import Container from "@/components/ui/container";
import React, { Suspense } from "react";
import Ecocerts from "./_components/Ecocerts";
import HeaderContent from "./_components/HeaderContent";

const ExplorePage = () => {
  return (
    <Container>
      <HeaderContent />
      <Suspense>
        <Ecocerts />
      </Suspense>
    </Container>
  );
};

export default ExplorePage;
