import {
  defaultEditorClassNames,
  defaultDisplayClassNames,
  generateClassNames,
} from "bsky-richtext-react";
import { cn } from "@/lib/utils";

const customClassNames = {
  mention: "text-primary",
  link: "text-primary",
};

export const richTextEditorClassNames = generateClassNames(
  [defaultEditorClassNames, customClassNames],
  cn
);

export const richTextDisplayClassNames = generateClassNames(
  [defaultDisplayClassNames, customClassNames],
  cn
);
