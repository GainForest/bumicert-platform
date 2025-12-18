import Container from "@/components/ui/container";
import Hero from "./_components/Home/Hero";
import Ecocerts from "./explore/_components/Ecocerts";
import HeaderContent from "./_components/Home/HeaderContent";
import Hero2 from "./_components/Home/Hero2";
import WhatIsEcocert from "./_components/Home/WhatIsEcocert";
import UserOptionCards from "./_components/Home/UserOptionCards";
import { Suspense } from "react";

export default function Home() {
  return (
    <Container>
      <HeaderContent />
      <Hero2 />
      <UserOptionCards />
      <WhatIsEcocert />
      {/* <Suspense>
        <Ecocerts />
      </Suspense> */}
    </Container>
  );
}
