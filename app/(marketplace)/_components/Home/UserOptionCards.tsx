import { Button } from "@/components/ui/button";
import { ArrowRight, HandHeartIcon, TreesIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const UserOptionCards = () => {
  return (
    <div className="flex items-center mt-4 gap-4">
      <div className="flex-1 bg-foreground/3 backdrop-blur-md rounded-3xl p-4 pt-20 relative">
        <HandHeartIcon className="size-10 absolute top-3 left-4 text-primary opacity-50" />
        <span className="font-serif text-primary font-bold text-3xl">
          I want to support a project.
        </span>
        <p className="mt-2 text-muted-foreground">
          Purchase Ecocerts to directly fund regenerative projects that restore
          nature and strengthen community resilience.
        </p>
        <Link href="/explore">
          <Button
            variant={"outline"}
            className="absolute top-2 right-2 rounded-xl"
          >
            Explore ecocerts <ArrowRight className="size-4" />
          </Button>
        </Link>
      </div>
      <div className="flex-1 bg-foreground/3 backdrop-blur-md rounded-3xl p-4 pt-20 relative">
        <TreesIcon className="size-10 absolute top-3 left-4 text-primary opacity-50" />
        <span className="font-serif text-primary font-bold text-3xl">
          I am an organization.
        </span>
        <p className="mt-2 text-muted-foreground">
          Create an Ecocert to showcase your regenerative impact and attract
          donors.
        </p>
        <Link href="/ecocert/create">
          <Button
            variant={"outline"}
            className="absolute top-2 right-2 rounded-xl"
          >
            Create an ecocert <ArrowRight className="size-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UserOptionCards;
