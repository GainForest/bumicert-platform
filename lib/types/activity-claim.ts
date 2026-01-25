/**
 * Local types for org.hypercerts.claim.activity lexicon
 * Based on hypercerts-lexicon develop branch
 * 
 * These types will later be abstracted into climateai-sdk
 */

import type { ComAtprotoRepoStrongRef } from "climateai-sdk/lex-api";

// ====================
// Activity Claim Record
// ====================

export interface ActivityClaimRecord {
    $type: "org.hypercerts.claim.activity";
    /** Title of the hypercert. */
    title: string;
    /** Short summary of this activity claim, suitable for previews and list views. */
    shortDescription: string;
    /** Rich text annotations for shortDescription */
    shortDescriptionFacets?: RichTextFacet[];
    /** Optional longer description of this activity claim. */
    description?: string;
    /** Rich text annotations for description */
    descriptionFacets?: RichTextFacet[];
    /** The hypercert visual representation as a URI or image blob. */
    image?: ImageUnion;
    /** Work scope definition - either a strongRef or a free-form string. */
    workScope?: WorkScopeUnion;
    /** When the work began */
    startDate?: string;
    /** When the work ended */
    endDate?: string;
    /** An array of contributor objects. */
    contributors?: Contributor[];
    /** A strong reference to the rights record. */
    rights?: ComAtprotoRepoStrongRef.Main;
    /** An array of strong references to location records. */
    locations?: ComAtprotoRepoStrongRef.Main[];
    /** Client-declared timestamp when this record was originally created */
    createdAt: string;
    [k: string]: unknown;
}

// ====================
// Contributor Types
// ====================

export interface Contributor {
    /** Contributor identity as a string (DID) or a strong reference. */
    contributorIdentity: ContributorIdentityUnion;
    /** The relative weight/importance of this contribution (stored as string). */
    contributionWeight?: string;
    /** Contribution details as a string or a strong reference. */
    contributionDetails?: ContributionDetailsUnion;
}

export type ContributorIdentityUnion =
    | ContributorIdentity
    | ComAtprotoRepoStrongRef.Main;

export interface ContributorIdentity {
    $type: "org.hypercerts.claim.activity#contributorIdentity";
    /** The contributor identifier (DID or name). */
    value: string;
}

export type ContributionDetailsUnion =
    | ContributorRole
    | ComAtprotoRepoStrongRef.Main;

export interface ContributorRole {
    $type: "org.hypercerts.claim.activity#contributorRole";
    /** The role/contribution details. */
    value: string;
}

// ====================
// Work Scope Types
// ====================

export type WorkScopeUnion = ComAtprotoRepoStrongRef.Main | WorkScopeString;

export interface WorkScopeString {
    $type: "org.hypercerts.claim.activity#workScopeString";
    /** A free-form string describing the work scope. */
    value: string;
}

// ====================
// Image Types (reusing from SDK defs)
// ====================

export type ImageUnion =
    | { $type: "org.hypercerts.defs#uri"; uri: string }
    | { $type: "org.hypercerts.defs#smallImage"; image: unknown };

// ====================
// Rich Text Types (from app.bsky.richtext.facet)
// ====================

export interface RichTextFacet {
    index: ByteSlice;
    features: RichTextFeature[];
}

export interface ByteSlice {
    byteStart: number;
    byteEnd: number;
}

export type RichTextFeature =
    | { $type: "app.bsky.richtext.facet#mention"; did: string }
    | { $type: "app.bsky.richtext.facet#link"; uri: string }
    | { $type: "app.bsky.richtext.facet#tag"; tag: string };

// ====================
// Helper Functions
// ====================

/**
 * Check if a value is a ContributorIdentity string type
 */
export function isContributorIdentityString(
    value: ContributorIdentityUnion
): value is ContributorIdentity {
    return (
        typeof value === "object" &&
        "$type" in value &&
        value.$type === "org.hypercerts.claim.activity#contributorIdentity"
    );
}

/**
 * Check if a value is a ContributorRole string type
 */
export function isContributorRoleString(
    value: ContributionDetailsUnion
): value is ContributorRole {
    return (
        typeof value === "object" &&
        "$type" in value &&
        value.$type === "org.hypercerts.claim.activity#contributorRole"
    );
}

/**
 * Check if a value is a WorkScopeString type
 */
export function isWorkScopeString(
    value: WorkScopeUnion
): value is WorkScopeString {
    return (
        typeof value === "object" &&
        "$type" in value &&
        value.$type === "org.hypercerts.claim.activity#workScopeString"
    );
}

/**
 * Check if a value is a StrongRef
 */
export function isStrongRef(
    value: unknown
): value is ComAtprotoRepoStrongRef.Main {
    return (
        typeof value === "object" &&
        value !== null &&
        "uri" in value &&
        "cid" in value
    );
}

/**
 * Extract display value from a contributor identity
 */
export function getContributorDisplayName(
    identity: ContributorIdentityUnion
): string {
    if (isContributorIdentityString(identity)) {
        return identity.value;
    }
    // For strongRef, we'd need to resolve it - return URI for now
    if (isStrongRef(identity)) {
        return identity.uri;
    }
    return "Unknown";
}

/**
 * Create a simple contributor from a name string
 */
export function createContributorFromName(name: string): Contributor {
    return {
        contributorIdentity: {
            $type: "org.hypercerts.claim.activity#contributorIdentity",
            value: name,
        },
    };
}

/**
 * Create a work scope string from an array of scope labels
 * (for simple migration from old withinAnyOf format)
 */
export function createWorkScopeFromLabels(labels: string[]): WorkScopeString {
    return {
        $type: "org.hypercerts.claim.activity#workScopeString",
        value: labels.join(", "),
    };
}

/**
 * Extract display labels from work scope
 * Handles both old format (withinAnyOf array) and new format (workScopeString)
 * Returns array of strings for display purposes
 */
export function getWorkScopeDisplayLabels(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    workScope: WorkScopeUnion | OldWorkScope | any | undefined
): string[] {
    if (!workScope) return [];

    // Handle old format with withinAnyOf (from SDK)
    if ("withinAnyOf" in workScope && Array.isArray(workScope.withinAnyOf)) {
        return workScope.withinAnyOf;
    }

    // Handle new workScopeString format
    if (isWorkScopeString(workScope)) {
        // Split comma-separated string into array
        return workScope.value
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);
    }

    // For strongRef, we'd need to resolve it - return empty for now
    return [];
}

/**
 * Old WorkScope type from SDK (for compatibility)
 */
interface OldWorkScope {
    $type?: "org.hypercerts.claim.activity#workScope";
    withinAllOf?: string[];
    withinAnyOf?: string[];
    withinNoneOf?: string[];
}
