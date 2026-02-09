"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, Search, Link as LinkIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { useDebounce } from "@/hooks/use-debounce";

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

    // For manual input
    const [manualQuery, setManualQuery] = useState(value);

    // Debounce query for search
    const debouncedQuery = useDebounce(query, 300);

    // Sync internal state with external value and on tab switch
    useEffect(() => {
        if (value !== query && activeTab === 'search') {
            setQuery(value);
        }
        if (value !== manualQuery && activeTab === 'manual') {
            setManualQuery(value);
        }
    }, [value, activeTab, query, manualQuery]);

    // Search Effect
    useEffect(() => {
        if (activeTab !== "search") return;

        const searchActors = async () => {
            if (!debouncedQuery || debouncedQuery.length < 3) {
                setActors([]);
                return;
            }

            setLoading(true);
            try {
                const queryParams = `q=${encodeURIComponent(debouncedQuery)}&limit=5`;
                const urls = [
                    `/api/proxy/climateai-search?${queryParams}`,
                    `https://public.api.bsky.app/xrpc/app.bsky.actor.searchActors?${queryParams}`
                ];

                const promises = urls.map(url =>
                    fetch(url).then(res => {
                        if (!res.ok) throw new Error(`Failed to fetch from ${url}`);
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

        searchActors();
    }, [debouncedQuery, activeTab]);

    const handleSelect = (actor: Actor) => {
        const formattedName = actor.displayName
            ? `${actor.displayName} (@${actor.handle})`
            : `@${actor.handle}`;

        onChange(formattedName);
        setQuery(formattedName);
        onNext?.(formattedName);
    };

    // Handle manual input change
    const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setManualQuery(newValue);
        onChange(newValue);
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
                    <Command className="border rounded-md bg-background overflow-hidden" shouldFilter={false}>
                        <div className="flex items-center border-b px-3">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <CommandInput
                                placeholder="Search by handle or name..."
                                value={query}
                                onValueChange={(val) => {
                                    setQuery(val);
                                    // Also update parent only if we want live updates during search typing
                                    // But typically for search-select, we might wait for selection. 
                                    // However, the existing logic updated on change, so let's keep it sync if needed,
                                    // though typically we only commit on select.
                                    // For now, let's strictly commit on select for consistency with Command pattern,
                                    // OR keep it loose. Given the reference, they select items.
                                }}
                                autoFocus={autoFocus}
                                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-none focus:ring-0"
                            />
                            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2" />}
                        </div>
                        <CommandList>
                            {!loading && actors.length === 0 && !!query && (
                                <CommandEmpty className="py-6 text-center text-sm">No results found.</CommandEmpty>
                            )}
                            {actors.length > 0 && (
                                <CommandGroup heading="Suggestions">
                                    {actors.map((actor) => (
                                        <CommandItem
                                            key={actor.did}
                                            value={actor.handle} // Use handle for value to avoid funky filtering if we enabled it
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
                ) : (
                    <InputGroup className="bg-background">
                        <LinkIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                        <InputGroupInput
                            placeholder="Contributor name, DID, or URI..."
                            value={manualQuery}
                            onChange={handleManualInputChange}
                            onKeyDown={handleKeyDown}
                            autoFocus={autoFocus}
                        />
                    </InputGroup>
                )}
            </div>
        </div>
    );
}
