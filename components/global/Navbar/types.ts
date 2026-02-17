import { LucideProps } from "lucide-react";
import { FC } from "react";

export type ClientLink = {
  Desktop: FC;
  Mobile: FC;
};

type NavLinkBase = {
  id: string;
  showIconOnlyOnDesktop?: boolean;
  openInNewTab?: boolean;
  Icon: FC<LucideProps>;
  text: string;
};

export type NavLinkLeaf = NavLinkBase & {
  href: string | ((did?: string) => string);
  pathCheck:
    | { equals: string | ((did?: string) => string) }
    | { startsWith: string | ((did?: string) => string) };
  children?: never;
};

type NavLinkGroup = NavLinkBase & {
  children: NavLinkLeaf[];
  href?: never;
  pathCheck?: never;
};

export type NavLinkConfig = NavLinkLeaf | NavLinkGroup;
