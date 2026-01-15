import { footerLinks } from "@/app/(marketplace)/_components/Home/Navbar/data";
import { NavLinkConfig } from "@/components/global/Navbar/types";
import { links } from "@/lib/links";
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
    href: links.upload.organization("a"),
    text: "Organization",
    Icon: Building2,
    pathCheck: {
      equals: links.upload.organization("a"),
    },
  },
  {
    id: "upload/organization/a/projects",
    href: links.upload.projects("a"),
    text: "Projects",
    Icon: Folder,
    pathCheck: {
      equals: links.upload.projects("a"),
    },
  },
  {
    id: "upload/organization/a/sites",
    href: links.upload.sites("a"),
    text: "Sites",
    Icon: Map,
    pathCheck: {
      equals: links.upload.sites("a"),
    },
  },
  {
    id: "upload/organization/a/layers",
    href: links.upload.layers("a"),
    text: "Layers",
    Icon: Satellite,
    pathCheck: {
      equals: links.upload.layers("a"),
    },
  },
  {
    id: "upload/organization/a/bumicerts",
    href: links.upload.bumicerts("a"),
    text: "Bumicerts",
    Icon: FileBadge2,
    pathCheck: {
      equals: links.upload.bumicerts("a"),
    },
  },
];

export const footerLinksForUploadPlatform: {
  href: string;
  text: string;
}[] = [
  {
    href: "/",
    text: "Home",
  },
  ...footerLinks,
];
