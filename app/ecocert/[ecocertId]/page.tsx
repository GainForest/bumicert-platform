import Container from "@/components/ui/container";
import { fetchFullHypercertById } from "@/graphql/hypercerts/queries/fullHypercertById";
import React from "react";
import Hero from "./_components/Hero";
import WidgetItem from "./_components/Widgets/WidgetItem";
import ProofsOfImpact from "./_components/Widgets/ProofsOfImpact";
import Body from "./_components/Body";
import HeaderContent from "./_components/HeaderContent";

const EcocertPage = async ({
  params,
}: {
  params: Promise<{ ecocertId: string }>;
}) => {
  const { ecocertId } = await params;

  const ecocert = await fetchFullHypercertById(ecocertId);

  return (
    <Container>
      <HeaderContent ecocert={ecocert} />
      <Hero ecocert={ecocert} />
      <Body ecocert={ecocert} />
      <hr className="my-4" />
      <div
        className={"grid gap-4"}
        style={{
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(460px, 100%), 1fr))",
        }}
      >
        <ProofsOfImpact ecocert={ecocert} />
        <WidgetItem title="Reviews">Hello</WidgetItem>
        <WidgetItem title="Support">Hello</WidgetItem>
        <WidgetItem title="Contributors & Evaluators">Hello</WidgetItem>
      </div>
    </Container>
  );
};

export default EcocertPage;
