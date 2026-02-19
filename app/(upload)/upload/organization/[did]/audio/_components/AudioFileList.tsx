"use client";

import { useState } from "react";
import { FileAudio, MessageSquarePlus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export type AudioFileEntry = {
  file: File;
  name: string;
  recordedAt: string; // ISO datetime-local string (YYYY-MM-DDTHH:mm)
  dateAutoDetected: boolean;
  description: string;
};

type AudioFileListProps = {
  entries: AudioFileEntry[];
  onEntriesChange: (entries: AudioFileEntry[]) => void;
};

const AudioFileList = ({ entries, onEntriesChange }: AudioFileListProps) => {
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(
    new Set()
  );

  if (entries.length === 0) {
    return null;
  }

  const updateEntry = (index: number, patch: Partial<AudioFileEntry>) => {
    const updated = entries.map((entry, i) =>
      i === index ? { ...entry, ...patch } : entry
    );
    onEntriesChange(updated);
  };

  const removeEntry = (index: number) => {
    const updated = entries.filter((_, i) => i !== index);
    // Shift expanded description indices down
    const newExpanded = new Set<number>();
    expandedDescriptions.forEach((idx) => {
      if (idx < index) newExpanded.add(idx);
      else if (idx > index) newExpanded.add(idx - 1);
    });
    setExpandedDescriptions(newExpanded);
    onEntriesChange(updated);
  };

  const toggleDescription = (index: number) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedDescriptions(newExpanded);
  };

  return (
    <div className="divide-y divide-border">
      {entries.map((entry, index) => {
        const isDescriptionExpanded = expandedDescriptions.has(index);

        return (
          <div key={index}>
            {/* Desktop Layout (md+) */}
            <div className="hidden md:flex items-center gap-3 py-3">
              <FileAudio className="size-5 text-muted-foreground shrink-0" />

              <Input
                className="flex-1 min-w-0"
                placeholder="Recording name"
                value={entry.name}
                onChange={(e) => updateEntry(index, { name: e.target.value })}
              />

              <div className="flex items-center gap-2 shrink-0">
                <Input
                  type="datetime-local"
                  className="w-48 shrink-0"
                  value={entry.recordedAt}
                  onChange={(e) =>
                    updateEntry(index, { recordedAt: e.target.value })
                  }
                />
                {entry.dateAutoDetected && (
                  <Badge variant="outline">auto</Badge>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleDescription(index)}
                title="Toggle description"
              >
                <MessageSquarePlus className="size-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => removeEntry(index)}
                title="Remove file"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>

            {/* Desktop description expansion */}
            <AnimatePresence>
              {isDescriptionExpanded && (
                <motion.div
                  key={`desc-desktop-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="hidden md:block overflow-hidden"
                >
                  <div className="pb-3 pl-8">
                    <Textarea
                      placeholder="Add a description (optional)"
                      rows={2}
                      value={entry.description}
                      onChange={(e) =>
                        updateEntry(index, { description: e.target.value })
                      }
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Layout (< md) */}
            <div className="flex md:hidden flex-col gap-2 py-3">
              {/* Row 1: Name input */}
              <Input
                className="w-full"
                placeholder="Recording name"
                value={entry.name}
                onChange={(e) => updateEntry(index, { name: e.target.value })}
              />

              {/* Row 2: Date + auto badge + remove button */}
              <div className="flex items-center gap-2">
                <Input
                  type="datetime-local"
                  className="flex-1"
                  value={entry.recordedAt}
                  onChange={(e) =>
                    updateEntry(index, { recordedAt: e.target.value })
                  }
                />
                {entry.dateAutoDetected && (
                  <Badge variant="outline">auto</Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleDescription(index)}
                  title="Toggle description"
                >
                  <MessageSquarePlus className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeEntry(index)}
                  title="Remove file"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              {/* Row 3: Description (if expanded) */}
              <AnimatePresence>
                {isDescriptionExpanded && (
                  <motion.div
                    key={`desc-mobile-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <Textarea
                      placeholder="Add a description (optional)"
                      rows={2}
                      value={entry.description}
                      onChange={(e) =>
                        updateEntry(index, { description: e.target.value })
                      }
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AudioFileList;
