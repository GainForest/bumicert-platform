import { LucideProps } from "lucide-react";
import { FC } from "react";

export type ClientLink = {
  Desktop: FC;
  Mobile: FC;
};

export type NavLinkConfig = {
  id: string;
  showIconOnlyOnDesktop?: boolean;
  openInNewTab?: boolean;
  pathCheck:
    | {
        equals: string;
      }
    | {
        startsWith: string;
      };
  href: string;
  text: string;
  Icon: FC<LucideProps>;
};
