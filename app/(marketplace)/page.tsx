import Container from "@/components/ui/container";
import HeaderContent from "./_components/Home/HeaderContent";
import Hero2 from "./_components/Home/Hero2";
import WhatIsBumicert from "./_components/Home/WhatIsBumicert";
import UserOptionCards from "./_components/Home/UserOptionCards";
import { Suspense } from "react";

export default function Home() {
  return (
    <Container>
      <HeaderContent />
      <Hero2 />
      <UserOptionCards />
      <WhatIsBumicert />
      {/* <Suspense>
        <Bumicerts />
      </Suspense> */}
    </Container>
  );
}
