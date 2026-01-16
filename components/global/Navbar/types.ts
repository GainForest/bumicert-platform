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
        equals: string | ((did?: string) => string);
      }
    | {
        startsWith: string | ((did?: string) => string);
      };
  href: string | ((did?: string) => string);
  text: string;
  Icon: FC<LucideProps>;
};
