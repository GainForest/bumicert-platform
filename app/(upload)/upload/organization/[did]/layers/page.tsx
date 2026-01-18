import React from "react";
import LayersHeaderContent from "./HeaderContent";
import Container from "@/components/ui/container";
import { TriangleAlert } from "lucide-react";

const LayersPage = () => {
  return (
    <Container>
      <LayersHeaderContent />
      <h1 className="font-serif font-bold text-3xl mb-6">Layers</h1>
      <div className="w-full bg-muted rounded-lg p-4 flex flex-col md:flex-row items-center justify-center gap-2">
        <TriangleAlert className="text-orange-400" />
        <span className="text-center">
          This page is still under development.
        </span>
      </div>
    </Container>
  );
};

export default LayersPage;
