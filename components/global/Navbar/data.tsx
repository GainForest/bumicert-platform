import {
  BadgePlus,
  Compass,
  MessageCircleQuestion,
  Settings,
} from "lucide-react";
import { NavLinkConfig } from "./types";

export const navLinks: NavLinkConfig<"dynamic" | "static">[] = [
  {
    type: "static",
    id: "explore",
    href: "/",
    text: "Explore",
    showIconOnlyOnDesktop: false,
    Icon: Compass,
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
    text: "Create",
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
  {
    type: "static",
    id: "settings",
    href: "/settings",
    text: "Settings",
    Icon: Settings,
    pathCheck: {
      startsWith: "/settings",
    },
  },
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
