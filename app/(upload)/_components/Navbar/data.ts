import { NavLinkConfig } from "@/components/global/Navbar/types";
import {
  BadgePlus,
  Building2,
  BuildingIcon,
  Compass,
  FileBadge2,
  Folder,
  Home,
  Map,
  Satellite,
} from "lucide-react";

export const navLinks: NavLinkConfig[] = [
  {
    id: "upload/organization",
    href: "/upload/organization/a",
    text: "Organization",
    Icon: Building2,
    pathCheck: {
      equals: "/upload/organization/a",
    },
  },
  {
    id: "upload/organization/a/projects",
    href: "/upload/organization/a/projects",
    text: "Projects",
    Icon: Folder,
    pathCheck: {
      equals: "/upload/organization/a/projects",
    },
  },
  {
    id: "upload/organization/a/sites",
    href: "/upload/organization/a/sites",
    text: "Sites",
    Icon: Map,
    pathCheck: {
      equals: "/upload/organization/a/sites",
    },
  },
  {
    id: "upload/organization/a/layers",
    href: "/upload/organization/a/layers",
    text: "Layers",
    Icon: Satellite,
    pathCheck: {
      equals: "/upload/organization/a/layers",
    },
  },
  {
    id: "upload/organization/a/ecocerts",
    href: "/upload/organization/a/ecocerts",
    text: "Ecocerts",
    Icon: FileBadge2,
    pathCheck: {
      equals: "/upload/organization/a/ecocerts",
    },
  },
];

export const footerLinks: {
  href: string;
  text: string;
}[] = [
  {
    href: "/",
    text: "Home",
  },
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
