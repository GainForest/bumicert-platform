"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, Trash2, Search, Link as LinkIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Type for ATProto actor
interface Actor {
    did: string;
    handle: string;
    displayName?: string;
    avatar?: string;
}

interface ContributorSelectorProps {
    value: string;
    onChange: (value: string) => void;
    onRemove: () => void;
    placeholder?: string;
    onNext?: (val?: string) => void;
    autoFocus?: boolean;
}

type Tab = "search" | "manual";

export function ContributorSelector({
    value,
    onChange,
    onRemove,
    placeholder = "Contributor name",
    onNext,
    autoFocus,
}: ContributorSelectorProps) {
    const [activeTab, setActiveTab] = useState<Tab>("manual");
    const [query, setQuery] = useState(value);
    const [actors, setActors] = useState<Actor[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    // Sync internal state with external value
    useEffect(() => {
        if (value !== query) {
            setQuery(value);
        }
    }, [value]);

    // Determine tab based on value content potentially?
    // For now, default to manual, but if value not simple string, maybe stay manual
    useEffect(() => {
        // If it looks like a DID or URI, manual is definitely correct.
        // If it's a simple name, manual is also correct.
        // Search is only for when actively searching.
        // So distinct logic might not be needed if manual is default.
    }, []);

    // Search Effect
    useEffect(() => {
        if (activeTab !== "search") return;

        const searchActors = async () => {
            if (!query || query.length < 3) {
                setActors([]);
                return;
            }

            setLoading(true);
            try {
                const endpoints = [
                    "/api/proxy/climateai-search",
                    "https://public.api.bsky.app"
                ];

                const promises = endpoints.map(endpoint =>
                    fetch(
                        `${endpoint}/xrpc/app.bsky.actor.searchActors?q=${encodeURIComponent(query)}&limit=5`
                    ).then(res => {
                        if (!res.ok) throw new Error(`Failed to fetch from ${endpoint}`);
                        return res.json();
                    })
                );

                const results = await Promise.allSettled(promises);

                let allActors: Actor[] = [];
                results.forEach(result => {
                    if (result.status === "fulfilled" && result.value.actors) {
                        allActors = [...allActors, ...result.value.actors];
                    }
                });

                // Deduplicate by DID
                const uniqueActors = Array.from(new Map(allActors.map(item => [item.did, item])).values());

                setActors(uniqueActors);
            } catch (error) {
                console.error("Failed to search actors", error);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            searchActors();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [query, activeTab]);

    const handleSelect = (actor: Actor) => {
        const formattedName = actor.displayName
            ? `${actor.displayName} (@${actor.handle})`
            : `@${actor.handle}`;

        onChange(formattedName);
        setQuery(formattedName);
        setOpen(false);
        onNext?.(formattedName);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setQuery(newValue);
        onChange(newValue);
        if (!open && activeTab === "search") setOpen(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            onNext?.();
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full border rounded-md p-3 bg-muted/20">
            <div className="flex items-center justify-between mb-1">
                <div className="flex bg-muted rounded-lg p-1 gap-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab("search")}
                        className={cn(
                            "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                            activeTab === "search"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        )}
                    >
                        Search Users
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("manual")}
                        className={cn(
                            "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                            activeTab === "manual"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        )}
                    >
                        Enter Name or ID
                    </button>
                </div>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onRemove}
                    className="text-muted-foreground hover:text-destructive"
                >
                    <Trash2 className="size-4" />
                </Button>
            </div>

            <div className="relative w-full">
                {activeTab === "search" ? (
                    <Popover open={open && actors.length > 0} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <div className="w-full">
                                <InputGroup className="bg-background">
                                    <Search className="h-4 w-4 ml-2 text-muted-foreground" />
                                    <InputGroupInput
                                        placeholder="Search by handle or name..."
                                        value={query}
                                        onChange={handleInputChange}
                                        onFocus={() => {
                                            if (actors.length > 0) setOpen(true);
                                        }}
                                        onKeyDown={handleKeyDown}
                                        autoFocus={autoFocus}
                                    />
                                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin text-muted-foreground" />}
                                </InputGroup>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent
                            className="p-0 w-[var(--radix-popover-trigger-width)]"
                            align="start"
                            onOpenAutoFocus={(e) => e.preventDefault()}
                        >
                            <Command shouldFilter={false}>
                                <CommandList>
                                    {actors.length > 0 && (
                                        <CommandGroup heading="Suggestions">
                                            {actors.map((actor) => (
                                                <CommandItem
                                                    key={actor.did}
                                                    value={actor.handle}
                                                    onSelect={() => handleSelect(actor)}
                                                    className="flex items-center gap-2 cursor-pointer"
                                                >
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={actor.avatar} />
                                                        <AvatarFallback>{actor.handle[0].toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col overflow-hidden">
                                                        <span className="font-medium truncate">{actor.displayName || actor.handle}</span>
                                                        <span className="text-xs text-muted-foreground truncate">@{actor.handle}</span>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    )}
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <InputGroup className="bg-background">
                        <LinkIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                        <InputGroupInput
                            placeholder="Contributor name, DID, or URI..."
                            value={query}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            autoFocus={autoFocus}
                        />
                    </InputGroup>
                )}
            </div>
        </div>
    );
}
