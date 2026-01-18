"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

// Caret positioning utilities
// Source - https://stackoverflow.com/a
// Posted by Wronski, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-17, License - CC BY-SA 4.0

const saveSelection = (
  containerEl: HTMLElement
): { start: number; end: number } => {
  const range = window.getSelection()?.getRangeAt(0);
  if (!range) {
    return { start: 0, end: 0 };
  }
  const preSelectionRange = range.cloneRange();
  preSelectionRange.selectNodeContents(containerEl);
  preSelectionRange.setEnd(range.startContainer, range.startOffset);
  const start = preSelectionRange.toString().length;

  return {
    start: start,
    end: start + range.toString().length,
  };
};

const restoreSelection = (
  containerEl: HTMLElement,
  savedSel: { start: number; end: number }
): void => {
  let charIndex = 0;
  const range = document.createRange();
  range.setStart(containerEl, 0);
  range.collapse(true);
  const nodeStack: Node[] = [containerEl];
  let node: Node | undefined;
  let foundStart = false;
  let stop = false;

  while (!stop && (node = nodeStack.pop())) {
    if (node.nodeType === 3) {
      // Text node
      const nextCharIndex = charIndex + (node.textContent?.length || 0);
      if (
        !foundStart &&
        savedSel.start >= charIndex &&
        savedSel.start <= nextCharIndex
      ) {
        range.setStart(node, savedSel.start - charIndex);
        foundStart = true;
      }
      if (
        foundStart &&
        savedSel.end >= charIndex &&
        savedSel.end <= nextCharIndex
      ) {
        range.setEnd(node, savedSel.end - charIndex);
        stop = true;
      }
      charIndex = nextCharIndex;
    } else {
      // Element node
      let i = node.childNodes.length;
      while (i--) {
        nodeStack.push(node.childNodes[i]);
      }
    }
  }

  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
};

const EditableText = ({
  component = "div",
  value,
  onChange,
  editable = false,
  placeholder = "Type here...",
  multiline = false,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "value"> & {
  component?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  value: string;
  onChange: (value: string) => void;
  editable?: boolean;
  placeholder?: string;
  multiline?: boolean;
}) => {
  const [isFocused, setFocused] = useState(false);
  const [caretPosition, setCaretPosition] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const normalizeValue = (value: string) => {
    return multiline ? value : value.replaceAll("\n", "");
  };

  // Normalize value as soon a non-normalized value appears
  useEffect(() => {
    if (multiline) return;
    const normalizedValue = normalizeValue(value);
    if (value === normalizedValue) return;
    onChange(normalizedValue);
  }, [value, multiline, onChange]);

  // Restore caret position after re-renders
  useLayoutEffect(() => {
    if (
      isFocused &&
      divRef.current &&
      caretPosition !== null &&
      document.activeElement === divRef.current
    ) {
      restoreSelection(divRef.current, caretPosition);
    }
  }, [caretPosition, isFocused]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (editable && divRef.current) {
      // Save caret position before state update
      const savedCaretPosition = saveSelection(target);
      setCaretPosition(savedCaretPosition);
      onChange(normalizeValue(target.innerText || ""));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (multiline || !editable) return;
    if (divRef.current && e.key === "Enter") e.preventDefault();
  };

  const handleBlur = () => {
    setFocused(false);
    // Clear caret position when blurring
    setCaretPosition(null);
  };

  const Comp = component;
  return (
    <Comp
      contentEditable={editable ? "plaintext-only" : undefined}
      suppressContentEditableWarning={true}
      {...props}
      ref={divRef}
      onInput={handleInput}
      onFocus={() => setFocused(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      {isFocused
        ? value
        : value.replaceAll("\n", "") === ""
        ? placeholder
        : value}
    </Comp>
  );
};

export default EditableText;
