import { Button } from "@/components/ui/button";
import { links } from "@/lib/links";
import { ArrowRight, HandHeartIcon, TreesIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const UserOptionCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4">
      <div className="flex flex-col justify-end bg-foreground/3 backdrop-blur-md rounded-3xl p-4 pt-20 relative">
        <HandHeartIcon className="size-10 absolute top-3 left-4 text-primary opacity-50" />
        <span className="font-serif text-primary font-bold text-3xl">
          I want to support a project.
        </span>
        <p className="mt-2 text-muted-foreground">
          Purchase Bumicerts to directly fund regenerative projects that restore
          nature and strengthen community resilience.
        </p>
        <Link href={links.explore}>
          <Button
            variant={"outline"}
            className="absolute top-2 right-2 rounded-xl"
          >
            Explore bumicerts <ArrowRight className="size-4" />
          </Button>
        </Link>
      </div>
      <div className="flex flex-col justify-end bg-foreground/3 backdrop-blur-md rounded-3xl p-4 pt-20 relative">
        <TreesIcon className="size-10 absolute top-3 left-4 text-primary opacity-50" />
        <span className="font-serif text-primary font-bold text-3xl">
          I am an organization.
        </span>
        <p className="mt-2 text-muted-foreground">
          Create a bumicert to showcase your regenerative impact and attract
          donors.
        </p>
        <Link href={links.bumicert.create}>
          <Button
            variant={"outline"}
            className="absolute top-2 right-2 rounded-xl"
          >
            Create a bumicert <ArrowRight className="size-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UserOptionCards;
