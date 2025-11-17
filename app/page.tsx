import Container from "@/components/ui/container";
import Hero from "./_components/Home/Hero";
import Ecocerts from "./explore/_components/Ecocerts";
import { Suspense } from "react";
import HeaderContent from "./_components/Home/HeaderContent";

export default function Home() {
  return (
    <Container>
      <HeaderContent />
      <Hero />
      <Suspense>
        <Ecocerts />
      </Suspense>
    </Container>
  );
}
