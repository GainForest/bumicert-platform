import { BadgePlus, BuildingIcon, Compass, Home } from "lucide-react";
import { NavLinkConfig } from "./types";

export const navLinks: NavLinkConfig[] = [
  {
    id: "home",
    href: "/",
    text: "Home",
    Icon: Home,
    pathCheck: {
      equals: "/",
    },
  },
  {
    id: "explore",
    href: "/explore",
    text: "Explore",
    showIconOnlyOnDesktop: false,
    Icon: Compass,
    pathCheck: {
      equals: "/explore",
    },
  },
  {
    id: "submit",
    href: "/ecocert/new",
    text: "Create",
    Icon: BadgePlus,
    pathCheck: {
      equals: "/ecocert/new",
    },
  },
  // {
  //   id: "faqs",
  //   href: "/faqs",
  //   text: "FAQs",
  //   Icon: MessageCircleQuestion,
  //   pathCheck: {
  //     startsWith: "/faqs",
  //   },
  // },
  {
    id: "organization",
    href: "/organization",
    text: "My Organization",
    Icon: BuildingIcon,
    pathCheck: {
      equals: "/organization",
    },
  },
  // {
  //   id: "settings",
  //   href: "/settings",
  //   text: "Settings",
  //   Icon: Settings,
  //   pathCheck: {
  //     startsWith: "/settings",
  //   },
  // },
];

export const footerLinks: {
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
