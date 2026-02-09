"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

interface ContributorRowProps {
    value: string;
    onEdit: (newValue: string) => void;
    onRemove: () => void;
}

export function ContributorRow({ value, onEdit, onRemove }: ContributorRowProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

    const handle = useMemo(() => {
        // Try matching "Name (@handle)"
        const parensMatch = value.match(/\(@([^)]+)\)/);
        if (parensMatch) return parensMatch[1];
        // Try matching starts with "@"
        if (value.startsWith("@")) return value.slice(1);
        // If it looks like a domain (e.g. contains dot), try using it as handle
        if (value.includes(".") && !value.includes(" ")) return value;
        return null;
    }, [value]);

    useEffect(() => {
        if (!handle) return;

        const controller = new AbortController();

        fetch(
            `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}`,
            { signal: controller.signal }
        )
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json();
            })
            .then((data) => {
                if (data.avatar) setAvatarUrl(data.avatar);
            })
            .catch((err) => {
                if (err.name !== "AbortError") setAvatarUrl(undefined);
            });

        return () => controller.abort();
    }, [handle]);

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
