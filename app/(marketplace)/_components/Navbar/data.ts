import { NavLinkConfig } from "@/components/global/Navbar/types";
import { links } from "@/lib/links";
import { BadgePlus, Building2, BuildingIcon, Compass, Home } from "lucide-react";

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
    text: "Explore",
    Icon: Compass,
    children: [
      {
        id: "explore-bumicerts",
        href: "/explore",
        text: "Bumicerts",
        Icon: Compass,
        pathCheck: {
          equals: "/explore",
        },
      },
      {
        id: "explore-organizations",
        href: links.allOrganizations,
        text: "Organizations",
        Icon: Building2,
        pathCheck: {
          equals: links.allOrganizations,
        },
      },
    ],
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
    id: "my-organization",
    href: links.myOrganization,
    text: "My Organization",
    Icon: BuildingIcon,
    pathCheck: {
      startsWith: links.myOrganization,
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
