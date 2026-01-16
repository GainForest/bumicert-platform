import Container from "@/components/ui/container";
import React, { Suspense } from "react";
import Bumicerts from "./_components/Bumicerts";
import HeaderContent from "./_components/HeaderContent";
import ExploreHydrator from "./_components/ExploreHydrator";

const ExplorePage = () => {
  return (
    <Container>
      <HeaderContent />
      <ExploreHydrator>
        <Suspense>
          <Bumicerts />
        </Suspense>
      </ExploreHydrator>
    </Container>
  );
};

export default ExplorePage;
