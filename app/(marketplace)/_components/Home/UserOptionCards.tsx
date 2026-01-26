import { Button } from "@/components/ui/button";
import { links } from "@/lib/links";
import { ArrowRight, HandHeartIcon, TreesIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const UserOptionCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-4">
      <Link
        href={links.explore}
        className="group flex flex-col justify-end bg-secondary/50 dark:bg-secondary/20 hover:bg-secondary/70 dark:hover:bg-secondary/30 rounded-2xl p-5 pt-20 relative transition-colors"
      >
        <HandHeartIcon className="size-8 absolute top-4 left-5 text-primary/60 group-hover:text-primary transition-colors" />
        <Button
          variant="outline"
          size="sm"
          className="absolute top-3 right-3 rounded-lg border-border/60 text-muted-foreground group-hover:text-foreground group-hover:border-primary/30 transition-colors"
        >
          Explore <ArrowRight className="size-3.5" />
        </Button>
        <span className="font-serif text-foreground text-2xl leading-tight">
          I want to support a project.
        </span>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Purchase Bumicerts to directly fund regenerative projects that restore
          nature and strengthen community resilience.
        </p>
      </Link>
      <Link
        href={links.bumicert.create}
        className="group flex flex-col justify-end bg-secondary/50 dark:bg-secondary/20 hover:bg-secondary/70 dark:hover:bg-secondary/30 rounded-2xl p-5 pt-20 relative transition-colors"
      >
        <TreesIcon className="size-8 absolute top-4 left-5 text-primary/60 group-hover:text-primary transition-colors" />
        <Button
          variant="outline"
          size="sm"
          className="absolute top-3 right-3 rounded-lg border-border/60 text-muted-foreground group-hover:text-foreground group-hover:border-primary/30 transition-colors"
        >
          Create <ArrowRight className="size-3.5" />
        </Button>
        <span className="font-serif text-foreground text-2xl leading-tight">
          I am an organization.
        </span>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Create a bumicert to showcase your regenerative impact and attract
          donors.
        </p>
      </Link>
    </div>
  );
};

export default UserOptionCards;
