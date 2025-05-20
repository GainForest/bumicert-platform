import React from "react";
import Image from "next/image";
import { ArrowUpRight, BadgePlus, Home } from "lucide-react";
import { MessageCircleQuestion } from "lucide-react";
import { NavLinkConfig } from "./types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProfileCard from "./ProfileCard";

const navLinks: NavLinkConfig<"dynamic" | "static">[] = [
  {
    type: "static",
    id: "home",
    href: "/",
    text: "Home",
    showIconOnlyOnDesktop: false,
    Icon: Home,
    pathCheck: {
      equals: "/",
    },
  },
  {
    type: "dynamic",
    id: "my-hypercerts",
    clientNode: {
      Desktop: () => <div>My Hypercerts</div>,
      Mobile: () => <div>My Hypercerts</div>,
    },
  },
  {
    type: "static",
    id: "submit",
    href: "/submit",
    text: "Submit",
    Icon: BadgePlus,
    pathCheck: {
      equals: "/submit",
    },
  },
  {
    type: "static",
    id: "faqs",
    href: "/faqs",
    text: "FAQs",
    Icon: MessageCircleQuestion,
    pathCheck: {
      startsWith: "/faqs",
    },
  },
];

const footerLinks: {
  href: string;
  text: string;
}[] = [
  {
    href: "https://github.com/ecocertain",
    text: "GitHub",
  },
  {
    href: "https://twitter.com/ecocertain",
    text: "Twitter",
  },
  {
    href: "https://www.canva.com/design/DAGNpwdK0jo/QkBOQ1gfl0gy8jDTBAo10g/view",
    text: "Impact Report",
  },
];

const Navbar = () => {
  return (
    <nav className="w-[240px] p-4 flex flex-col justify-between">
      {/* Top Section */}
      <div className="flex flex-col gap-2">
        {/* Header */}
        <div className="h-12 w-12 border border-border rounded-xl shadow-lg bg-background flex items-center justify-center">
          <Image
            src="/assets/media/images/logo.svg"
            alt="Ecocertain"
            width={32}
            height={32}
          />
        </div>
        <b className="font-serif text-2xl drop-shadow-lg">Ecocertain</b>

        {/* Nav Links */}
        <ul className="mt-2 bg-background border border-border rounded-lg shadow-lg p-0.5">
          {navLinks.map((link) => {
            if (link.type !== "static") return;
            return (
              <li key={link.id} className="w-full">
                <Link href={link.href} className="w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-left justify-start"
                  >
                    <link.Icon size={16} className="text-primary/70" />
                    <span>{link.text}</span>
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-2">
        {/* Profile */}
        <ProfileCard />

        {/* Footer */}
        <div className="flex flex-col">
          <ul className="flex flex-col">
            {footerLinks.map((link) => {
              return (
                <li key={link.href}>
                  <Link href={link.href} target="_blank">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-left justify-between"
                    >
                      <span>{link.text}</span>
                      <ArrowUpRight size={16} className="text-primary" />
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
