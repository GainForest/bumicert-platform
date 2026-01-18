"use client";

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  type MDXEditorProps,
  Separator,
  UndoRedo,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useState } from "react";
import { useTheme } from "next-themes";

function MarkdownEditor({
  showToolbar = true,
  toolbarSize = "md",
  ...props
}: MDXEditorProps & {
  showToolbar?: boolean;
  toolbarSize?: "sm" | "md";
}) {
  const { theme } = useTheme();
  const [isMounted, setMounted] = useState(() => typeof window !== "undefined");

  // Use queueMicrotask to defer state update and avoid synchronous setState
  if (typeof window !== "undefined" && !isMounted) {
    queueMicrotask(() => {
      setMounted(true);
    });
  }

  if (!isMounted) return null;

  const customizedToolbarPlugin = () =>
    toolbarPlugin({
      toolbarContents: () => {
        return (
          <div className="flex flex-col">
            <div className="flex items-center">
              <UndoRedo />

              <Separator />

              <BoldItalicUnderlineToggles />

              {toolbarSize === "md" && (
                <>
                  <Separator />

                  <BlockTypeSelect />
                </>
              )}

              <Separator />

              <ListsToggle />

              <Separator />

              <CreateLink />

              {toolbarSize === "md" && (
                <>
                  <InsertTable />

                  <Separator />

                  <InsertThematicBreak />
                </>
              )}
            </div>
          </div>
        );
      },
    });

  return (
    <MDXEditor
      className={theme === "dark" ? "dark-editor dark-theme" : undefined}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        tablePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        ...(showToolbar ? [customizedToolbarPlugin()] : []),
      ]}
      {...props}
    />
  );
}

export default MarkdownEditor;
