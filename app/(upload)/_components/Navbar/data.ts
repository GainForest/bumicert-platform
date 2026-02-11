import { footerLinks } from "@/app/(marketplace)/_components/Navbar/data";
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
  Mic,
  Satellite,
} from "lucide-react";

export const navLinks: NavLinkConfig[] = [
  {
    id: "upload/organization",
    href: links.upload.organization,
    text: "Organization",
    Icon: Building2,
    pathCheck: {
      equals: links.upload.organization,
    },
  },
  {
    id: "upload/organization/a/projects",
    href: links.upload.projects,
    text: "Projects",
    Icon: Folder,
    pathCheck: {
      equals: links.upload.projects,
    },
  },
  {
    id: "upload/organization/a/sites",
    href: links.upload.sites,
    text: "Sites",
    Icon: Map,
    pathCheck: {
      equals: links.upload.sites,
    },
  },
  {
    id: "upload/organization/a/layers",
    href: links.upload.layers,
    text: "Layers",
    Icon: Satellite,
    pathCheck: {
      equals: links.upload.layers,
    },
  },
  {
    id: "upload/organization/a/audio",
    href: links.upload.audio,
    text: "Audio",
    Icon: Mic,
    pathCheck: {
      equals: links.upload.audio,
    },
  },
  {
    id: "upload/organization/a/bumicerts",
    href: links.upload.bumicerts,
    text: "Bumicerts",
    Icon: FileBadge2,
    pathCheck: {
      equals: links.upload.bumicerts,
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
