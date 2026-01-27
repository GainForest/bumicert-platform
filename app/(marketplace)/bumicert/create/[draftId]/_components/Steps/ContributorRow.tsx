"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

interface ContributorRowProps {
    value: string;
    onEdit: (newValue: string) => void;
    onRemove: () => void;
}

export function ContributorRow({ value, onEdit, onRemove }: ContributorRowProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

    // Parse handle to fetch avatar if possible
    useEffect(() => {
        let cancelled = false;
        
        // Parse handle from value
        let handle: string | null = null;

        // Try matching "Name (@handle)"
        const parensMatch = value.match(/\(@([^)]+)\)/);
        if (parensMatch) {
            handle = parensMatch[1];
        }
        // Try matching starts with "@"
        else if (value.startsWith("@")) {
            handle = value.slice(1);
        }
        // If it looks like a domain (e.g. contains dot), try using it as handle
        else if (value.includes(".") && !value.includes(" ")) {
            handle = value;
        }

        if (handle) {
            // Fetch avatar from Bluesky public API
            fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}`)
                .then((res) => {
                    if (!res.ok) throw new Error("Failed to fetch");
                    return res.json();
                })
                .then((data) => {
                    if (!cancelled) {
                        setAvatarUrl(data.avatar || undefined);
                    }
                })
                .catch(() => {
                    if (!cancelled) {
                        setAvatarUrl(undefined);
                    }
                });
        }
        
        // Cleanup: clear avatar on dependency change and mark as cancelled
        return () => {
            cancelled = true;
            setAvatarUrl(undefined);
        };
    }, [value]);

    const handleSave = () => {
        onEdit(editValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValue(value);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
        } else if (e.key === "Escape") {
            handleCancel();
        }
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-2 p-3 border rounded-md bg-background">
                <InputGroup className="flex-1">
                    <InputGroupInput
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                        onKeyDown={handleKeyDown}
                    />
                </InputGroup>
                <Button size="icon-sm" variant="ghost" onClick={handleSave}>
                    <Check className="size-4 text-green-500" />
                </Button>
                <Button size="icon-sm" variant="ghost" onClick={handleCancel}>
                    <X className="size-4 text-muted-foreground" />
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between p-3 border rounded-md bg-background">
            <div className="flex items-center gap-3 overflow-hidden">
                <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>{value[0]?.toUpperCase() || "?"}</AvatarFallback>
                </Avatar>
                <span className="font-medium truncate">{value}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
                <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <Pencil className="size-4" />
                </Button>
                <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={onRemove}
                    className="text-muted-foreground hover:text-destructive"
                >
                    <Trash2 className="size-4" />
                </Button>
            </div>
        </div>
    );
}
