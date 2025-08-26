import { LucideProps } from "lucide-react";
import { FC } from "react";

export type ClientLink = {
  Desktop: FC;
  Mobile: FC;
};

export type NavLinkConfig<T extends "static" | "dynamic"> = {
  id: string;
  showIconOnlyOnDesktop?: boolean;
  openInNewTab?: boolean;
  pathCheck?:
    | {
        equals: string;
      }
    | {
        startsWith: string;
      };
} & (T extends "static"
  ? {
      type: "static";
      href: string;
      text: string;
      Icon: FC<LucideProps>;
      clientNode?: never;
    }
  : {
      type: "dynamic";
      href?: never;
      text?: never;
      Icon?: never;
      clientNode: ClientLink;
    });
