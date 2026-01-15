import Container from "@/components/ui/container";
import React, { Suspense } from "react";
import Bumicerts from "./_components/Bumicerts";
import HeaderContent from "./_components/HeaderContent";

const ExplorePage = () => {
  return (
    <Container>
      <HeaderContent />
      <Suspense>
        <Bumicerts />
      </Suspense>
    </Container>
  );
};

export default ExplorePage;
