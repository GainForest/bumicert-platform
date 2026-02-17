import { OrgHypercertsClaimActivity } from "gainforest-sdk/lex-api";
import { $Typed } from "gainforest-sdk/lex-api/utils";

/**
 * Extracts work scope items from a bumicert's workScope field.
 * 
 * Handles WorkScopeString type by splitting comma-delimited scope strings.
 * StrongRef types are currently ignored and return an empty array.
 * 
 * @param workScope - The workScope field from OrgHypercertsClaimActivity.Record
 * @returns Array of work scope item strings, or empty array if no valid scope
 * 
 * @example
 * ```tsx
 * const items = getWorkScopeItems(bumicert.workScope);
 * // Returns: ["Reforestation", "Carbon Sequestration", "Biodiversity"]
 * ```
 */
export function getWorkScopeItems(
  workScope: OrgHypercertsClaimActivity.Record['workScope']
): string[] {
  if (!workScope) return [];
  
  // For now we ignore strong refs and assume it is always a string delimited by commas
  if (workScope.$type === "org.hypercerts.claim.activity#workScopeString") {
    const workScopeString = workScope as $Typed<OrgHypercertsClaimActivity.WorkScopeString>;
    return workScopeString.scope.split(',').map(s => s.trim()).filter(Boolean);
  }
  
  return [];
}
