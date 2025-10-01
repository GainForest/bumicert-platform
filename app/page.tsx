import Container from "@/components/ui/container";
import Hero from "./_components/Home/Hero";
import Ecocerts from "./explore/_components/Ecocerts";
import { Suspense } from "react";

export default function Home() {
  return (
    <Container>
      <Hero />
      <Suspense>
        <Ecocerts />
      </Suspense>
    </Container>
  );
}
