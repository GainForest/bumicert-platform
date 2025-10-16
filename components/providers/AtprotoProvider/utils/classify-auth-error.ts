export function classifyAuthError(
  error: unknown
): "stale_session" | "network" | "permission" | "unknown" {
  const msg = String((error as Error)?.message ?? error ?? "").toLowerCase();

  if (
    /invalid[_\s-]?(state|grant|session|authorization)|expired|unknown authorization/i.test(
      msg
    )
  ) {
    return "stale_session";
  }

  if (/network|fetch|timeout|connection|dns/i.test(msg)) {
    return "network";
  }

  if (/permission|forbidden|unauthorized|access.*denied/i.test(msg)) {
    return "permission";
  }

  return "unknown";
}
