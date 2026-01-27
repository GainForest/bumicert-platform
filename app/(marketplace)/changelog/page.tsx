import Container from "@/components/ui/container";
import { cn } from "@/lib/utils";
import fs from "fs";
import path from "path";
import React from "react";
import HeaderContent from "./_components/HeaderContent";

// Simple Markdown Parser for the specific structure we created
function parseMarkdown(content: string) {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];

    const flushList = (keyPrefix: string) => {
        if (currentList.length > 0) {
            elements.push(
                <ul key={`${keyPrefix}-list`} className="list-disc pl-5 space-y-2 mb-4 text-muted-foreground">
                    {currentList}
                </ul>
            );
            currentList = [];
        }
    };

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        // Images ![Alt](src)
        const imageMatch = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
        if (imageMatch) {
            flushList(`pre-${index}`);
            const [_, alt, src] = imageMatch;
            elements.push(
                <div key={index} className="mb-6 mt-6 rounded-xl overflow-hidden border border-border shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={src}
                        alt={alt}
                        className="w-full h-auto object-cover"
                    />
                </div>
            );
            return;
        }

        // Headings (#, ##, ###)
        const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)/);
        if (headingMatch) {
            flushList(`pre-${index}`);
            const level = headingMatch[1].length;
            const text = headingMatch[2];

            elements.push(
                <h3 key={index} className={cn(
                    "font-serif font-medium text-foreground mb-3",
                    level === 1 ? "text-xl mt-8 first:mt-0" : "text-lg mt-6"
                )}>
                    {text}
                </h3>
            );
            return;
        }

        // List items (* item)
        if (trimmed.startsWith("* ")) {
            currentList.push(
                <li key={index}>
                    {parseInline(trimmed.substring(2))}
                </li>
            );
            return;
        }

        // Paragraphs
        flushList(`pre-${index}`);
        elements.push(
            <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                {parseInline(trimmed)}
            </p>
        );
    });

    flushList("final");
    return elements;
}

// Helper to handle bold text (**text**)
function parseInline(text: string): React.ReactNode {
    const parts = text.split(/(\*\*.*?\*\*)/);
    return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
}

// Parse the raw markdown into version entries
function parseChangelogFile(fileContent: string) {
    // Split by version headers: ## vX.X.X - Date
    const versionRegex = /^## (v\d+\.\d+\.\d+) - (.*)$/gm;

    // Find all matches to get indices
    const matches = [...fileContent.matchAll(versionRegex)];

    if (matches.length === 0) {
        // Fallback: If no headers, treat whole file as one entry (e.g. initial dev state)
        return null;
    }

    const entries = [];

    for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const version = match[1];
        const date = match[2];
        const startIdx = match.index + match[0].length;
        const endIdx = i < matches.length - 1 ? matches[i + 1].index : fileContent.length;

        const content = fileContent.substring(startIdx, endIdx).trim();

        entries.push({
            version,
            date,
            content: parseMarkdown(content)
        });
    }

    return entries;
}

export default async function ChangelogPage() {
    // Read CHANGELOG.md
    const changelogPath = path.join(process.cwd(), "CHANGELOG.md");
    let changelogContent = "";
    try {
        changelogContent = fs.readFileSync(changelogPath, "utf8");
    } catch (error) {
        console.error("Error reading CHANGELOG.md", error);
        return (
            <Container className="py-24">
                <p className="text-muted-foreground">CHANGELOG.md not found.</p>
            </Container>
        );
    }

    // Parse entries
    const parsedEntries = parseChangelogFile(changelogContent);
    let entries = parsedEntries;

    // Fallback if no version headers found (backward compatibility)
    if (!entries) {
        const packageJsonPath = path.join(process.cwd(), "package.json");
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
        const version = `v${packageJson.version}`;
        const releaseDate = "Jan 24, 2026"; // Default

        entries = [{
            version,
            date: releaseDate,
            content: parseMarkdown(changelogContent)
        }];
    }

    return (
        <>
        <HeaderContent />
        <Container className="py-12 md:py-24 max-w-4xl mx-auto">
            <div className="mb-16">
                <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4 text-primary">
                    Changelog
                </h1>
                <p className="text-lg text-muted-foreground font-sans max-w-xl">
                    New updates and improvements to the Bumicert platform.
                </p>
            </div>

            <div className="space-y-16">
                {entries.map((entry, index) => (
                    <div
                        key={index}
                        className="flex flex-col md:grid md:grid-cols-[200px_1fr] gap-4 md:gap-8"
                    >
                        {/* Left Column: Date and Version */}
                        <div className="font-mono text-sm">
                            <div className="text-muted-foreground sticky top-24">
                                <span className="block mb-1">{entry.date}</span>
                                <span className="inline-block px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
                                    {entry.version}
                                </span>
                            </div>
                        </div>

                        {/* Right Column: Content */}
                        <div className="font-sans">
                            {/* For simplicity we default logic to just show content. 
                  If we wanted per-release titles (e.g. "The Big Update"), 
                  we could parse an H1 from the content block. 
              */}
                            <div className="max-w-none">
                                {entry.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Container>
        </>
    );
}
