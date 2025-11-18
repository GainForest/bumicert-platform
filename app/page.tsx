import Container from "@/components/ui/container";
import Hero from "./_components/Home/Hero";
import Ecocerts from "./explore/_components/Ecocerts";
import { Suspense } from "react";
import HeaderContent from "./_components/Home/HeaderContent";
import Hero2 from "./_components/Home/Hero2";

export default function Home() {
  return (
    <Container>
      <HeaderContent />
      <Hero2 />
      {/* <Suspense>
        <Ecocerts />
      </Suspense> */}
    </Container>
  );
}
