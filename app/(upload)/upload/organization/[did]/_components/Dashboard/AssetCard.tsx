"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Map, FileText, MoreHorizontal, Pencil, Trash2, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/ui/modal/context";
import {
  SiteEditorModal,
  SiteEditorModalId,
} from "@/components/global/modals/upload/site/editor";
import Link from "next/link";
import { links } from "@/lib/links";
import { parseAtUri } from "climateai-sdk/utilities/atproto";

interface AssetCardProps {
  type: "sites" | "bumicerts";
  name: string;
  description?: string;
  createdAt?: string;
  data: unknown;
}

const typeConfig = {
  sites: {
    icon: Map,
    label: "Site",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  bumicerts: {
    icon: FileText,
    label: "Bumicert",
    color: "bg-primary/10 text-primary",
  },
};

const AssetCard = ({ type, name, description, createdAt, data }: AssetCardProps) => {
  const { pushModal, show } = useModal();
  const config = typeConfig[type];
  const Icon = config.icon;

  const handleEdit = () => {
    if (type === "sites") {
      pushModal(
        { id: SiteEditorModalId, content: <SiteEditorModal initialData={data as never} /> },
        true
      );
      show();
    }
  };

  const getBumicertLink = () => {
    if (type === "bumicerts" && data) {
      const record = data as { uri: string };
      const parsed = parseAtUri(record.uri);
      return links.bumicert.view(`${parsed.did}-${parsed.rkey}`);
    }
    return null;
  };

  const bumicertLink = getBumicertLink();

  return (
    <div className="group relative bg-background border border-border/50 rounded-lg p-4 hover:border-border transition-colors">
      {/* Type badge */}
      <div className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mb-3",
        config.color
      )}>
        <Icon className="size-3" strokeWidth={1.5} />
        {config.label}
      </div>

      {/* Content */}
      <h3 className="font-medium text-foreground mb-1 pr-8 line-clamp-1">{name}</h3>
      {description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-xs text-muted-foreground/70">
          {createdAt ? format(new Date(createdAt), "MMM d, yyyy") : "—"}
        </span>
      </div>

      {/* Actions */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="h-7 w-7">
              <MoreHorizontal className="size-4" strokeWidth={1.5} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {type === "sites" && (
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil className="size-4 mr-2" strokeWidth={1.5} />
                Edit
              </DropdownMenuItem>
            )}
            {bumicertLink && (
              <DropdownMenuItem asChild>
                <Link href={bumicertLink}>
                  <ExternalLink className="size-4 mr-2" strokeWidth={1.5} />
                  View
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-amber-600 dark:text-amber-500">
              <Trash2 className="size-4 mr-2" strokeWidth={1.5} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AssetCard;
