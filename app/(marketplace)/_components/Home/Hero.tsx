import { Leaf } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BumicertCard = ({ title, index }: { title: string; index: number }) => {
  return (
    <div className="w-[100px] rounded-xl p-1 shadow-lg bg-background/90 shrink-0 relative">
      <div className="w-full h-[100px] rounded-xl bg-primary relative overflow-hidden">
        <Image
          src={`/assets/media/images/hero-bumicert-card/image${index}.png`}
          className="object-cover"
          alt="Bumicert"
          fill
        />
        <div className="absolute bottom-0 left-0 right-0 p-2 pt-6 font-serif font-bold text-white drop-shadow-sm bg-gradient-to-b from-black/0 to-black/50">
          {title}
        </div>
      </div>
      <div className="flex items-center py-1 gap-2">
        <div className="h-2 flex-1 rounded-full bg-primary/20">
          <div className="h-full w-[80%] bg-primary rounded-full"></div>
        </div>
        <Leaf size={14} className="text-primary" />
      </div>
    </div>
  );
};

const bumicertCardTitles = ["Planting trees", "Saving birds", "Cleaning water"];

const Hero = () => {
  return (
    <div className="w-full rounded-xl shadow-xl overflow-hidden">
      <div
        className="w-full py-8 md:py-0 md:h-[200px] flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 rounded-xl overflow-hidden"
        style={{
          background: `repeating-linear-gradient(
                -55deg,
                color-mix(in oklab, var(--primary) 5%, transparent),
                color-mix(in oklab, var(--primary) 5%, transparent) 8px,
                color-mix(in oklab, var(--primary) 20%, transparent) 8px,
                color-mix(in oklab, var(--primary) 20%, transparent) 16px
              )`,
        }}
      >
        <div className="flex-3/5 lg:flex-1 flex items-center justify-center">
          <div className="flex items-center gap-[50px] scale-100 md:scale-125 group">
            {bumicertCardTitles.map((title, index) => (
              <div
                className="w-1 flex items-center justify-center group-hover:not-hover:blur-sm group-hover:not-hover:scale-95 group-hover:not-hover:opacity-50 group-hover:hover:blur-none group-hover:hover:scale-105 group-hover:hover:opacity-100 transition-all duration-500"
                key={index}
              >
                <BumicertCard title={title} index={index} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex-2/5 lg:flex-1 flex items-center justify-center text-center text-balance text-2xl md:text-4xl text-primary">
          <p className="flex flex-col font-serif font-bold drop-shadow-xl">
            <span>Fund</span>
            <span className="italic">impactful</span>
            <span>regenerative projects.</span>
          </p>
        </div>
      </div>
      <div className="w-full flex items-center justify-center p-1 text-sm text-muted-foreground text-center text-balance">
        <span>
          🎉🎉🎉 We are thrilled to announce the newest version of Bumicertain.
          Read our{" "}
          <Link href={"/changelog"} className="underline">
            changelog
          </Link>
          .
        </span>
      </div>
    </div>
  );
};

export const HeroBumicertCards = () => {
  return (
    <div className="flex items-center gap-[50px] scale-100 md:scale-125 group">
      {bumicertCardTitles.map((title, index) => (
        <div
          className="w-1 flex items-center justify-center group-hover:not-hover:blur-sm group-hover:not-hover:scale-95 group-hover:not-hover:opacity-50 group-hover:hover:blur-none group-hover:hover:scale-105 group-hover:hover:opacity-100 transition-all duration-500"
          key={index}
        >
          <BumicertCard title={title} index={index} />
        </div>
      ))}
    </div>
  );
};

export default Hero;
