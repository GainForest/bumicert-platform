import Container from "@/components/ui/container";
import React, { Suspense } from "react";
import Bumicerts from "./_components/Bumicerts";
import HeaderContent from "./_components/HeaderContent";
import ExploreHydrator from "./_components/ExploreHydrator";
import ExploreHero from "./_components/ExploreHero";
import ExploreFilters from "./_components/ExploreFilters";

const ExplorePage = () => {
  return (
    <Container className="pb-16">
      <HeaderContent />
      <ExploreHydrator>
        <ExploreHero />
        <Suspense>
          <ExploreFilters />
        </Suspense>
        <Suspense>
          <Bumicerts />
        </Suspense>
      </ExploreHydrator>
    </Container>
  );
};

export default ExplorePage;
