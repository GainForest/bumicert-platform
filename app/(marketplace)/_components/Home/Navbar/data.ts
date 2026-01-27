import { NavLinkConfig } from "@/components/global/Navbar/types";
import { links } from "@/lib/links";
import { BadgePlus, Compass, Home, LayoutDashboard } from "lucide-react";

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
    href: links.bumicert.create,
    text: "Create",
    Icon: BadgePlus,
    pathCheck: {
      startsWith: links.bumicert.create,
    },
  },
  {
    id: "my-organization",
    href: links.upload.organization,
    text: "Dashboard",
    Icon: LayoutDashboard,
    pathCheck: {
      startsWith: "/upload/organization",
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
      href: "https://github.com/ecocertain-2",
      text: "GitHub",
    },
    {
      href: "https://twitter.com/GainForestNow",
      text: "Twitter",
    },
    {
      href: "/changelog",
      text: "Changelog",
    },
    {
      href: "https://www.canva.com/design/DAGNpwdK0jo/QkBOQ1gfl0gy8jDTBAo10g/view",
      text: "Impact Report",
    },
  ];
