import { Button } from "@/components/ui/button";
import { links } from "@/lib/links";
import { ArrowRight, HandHeartIcon, TreesIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const UserOptionCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4">
      <div className="flex flex-col justify-end bg-gradient-to-br from-background via-background to-primary/5 border border-border/30 rounded-3xl p-4 pt-20 relative overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-primary/3 rounded-full blur-2xl" />
        <HandHeartIcon className="size-10 absolute top-3 left-4 text-primary opacity-50" />
        <span className="font-serif text-primary font-bold text-3xl">
          Discover impact
        </span>
        <p className="mt-2 text-muted-foreground">
          Explore verified conservation projects from communities worldwide. Find
          work that resonates with you and support it directly.
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
      <div className="flex flex-col justify-end bg-gradient-to-br from-background via-background to-primary/5 border border-border/30 rounded-3xl p-4 pt-20 relative overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-primary/3 rounded-full blur-2xl" />
        <TreesIcon className="size-10 absolute top-3 left-4 text-primary opacity-50" />
        <span className="font-serif text-primary font-bold text-3xl">
          Certify your work
        </span>
        <p className="mt-2 text-muted-foreground">
          Turn your conservation efforts into verifiable digital certificates.
          Connect with funders who share your mission.
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
