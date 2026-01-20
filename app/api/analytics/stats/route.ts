import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";

// Step names for funnel display
const STEP_NAMES = [
  "Flow Started",
  "Step 1: Cover Details",
  "Step 2: Impact Details",
  "Step 3: Site Details",
  "Step 4: Review",
  "Step 5: Submit",
];

type FunnelStep = {
  step: string;
  users: number;
  dropOff: number;
  rate: number;
};

type TimeDistribution = {
  range: string;
  count: number;
  percentage: number;
};

type AnalyticsStats = {
  totalFlowStarts: number;
  totalCompletions: number;
  completionRate: number;
  avgTimeToComplete: number;
  medianTimeToComplete: number;
  funnelSteps: FunnelStep[];
  timeDistribution: TimeDistribution[];
  lastUpdated: string;
};

/**
 * GET /api/analytics/stats
 * Returns aggregated analytics data for the dashboard
 */
export async function GET(): Promise<NextResponse<AnalyticsStats>> {
  // Run all queries in parallel for better performance
  const [
    { count: flowStartsCount },
    { count: completionsCount },
    { data: completedSessions },
  ] = await Promise.all([
    supabaseAdmin
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .eq("event_type", "flow_started"),
    supabaseAdmin
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .eq("event_type", "bumicert_published"),
    supabaseAdmin
      .from("analytics_sessions")
      .select("completion_duration_seconds")
      .eq("completed", true)
      .not("completion_duration_seconds", "is", null),
  ]);

  const totalFlowStarts = flowStartsCount ?? 0;
  const totalCompletions = completionsCount ?? 0;

  // Calculate completion rate
  const completionRate =
    totalFlowStarts > 0
      ? Math.round((totalCompletions / totalFlowStarts) * 1000) / 10
      : 0;

  const durations = (completedSessions ?? [])
    .map((s) => s.completion_duration_seconds as number)
    .filter((d) => d > 0)
    .sort((a, b) => a - b);

  const avgTimeToComplete =
    durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;

  const medianTimeToComplete =
    durations.length > 0
      ? durations[Math.floor(durations.length / 2)] ?? 0
      : 0;

  // Build funnel data
  const funnelSteps = await buildFunnelData(totalFlowStarts);

  // Build time distribution
  const timeDistribution = buildTimeDistribution(durations);

  return NextResponse.json({
    totalFlowStarts,
    totalCompletions,
    completionRate,
    avgTimeToComplete,
    medianTimeToComplete,
    funnelSteps,
    timeDistribution,
    lastUpdated: new Date().toISOString(),
  });
}

/**
 * Build funnel data by counting step_viewed events per step
 */
async function buildFunnelData(totalFlowStarts: number): Promise<FunnelStep[]> {
  // Get count of unique sessions that viewed each step (parallel queries)
  const stepCounts: number[] = [totalFlowStarts];

  // Fetch all step queries in parallel
  const stepQueries = Array.from({ length: 5 }, (_, stepIndex) =>
    supabaseAdmin
      .from("analytics_events")
      .select("session_id")
      .eq("event_type", "step_viewed")
      .contains("event_data", { stepIndex })
  );

  const stepResults = await Promise.all(stepQueries);

  // Count unique sessions for each step
  for (const result of stepResults) {
    const uniqueSessions = new Set(
      (result.data ?? []).map((e) => e.session_id)
    );
    stepCounts.push(uniqueSessions.size);
  }

  // Build funnel array with drop-off calculations
  return STEP_NAMES.map((stepName, index) => {
    const users = stepCounts[index] ?? 0;
    const prevUsers = index > 0 ? (stepCounts[index - 1] ?? 0) : users;
    const dropOff = index > 0 ? prevUsers - users : 0;
    const rate = totalFlowStarts > 0 ? (users / totalFlowStarts) * 100 : 0;

    return {
      step: stepName,
      users,
      dropOff,
      rate: Math.round(rate * 10) / 10,
    };
  });
}

/**
 * Build time distribution buckets from completion durations
 */
function buildTimeDistribution(durations: number[]): TimeDistribution[] {
  const buckets = [
    { range: "< 5 min", max: 300, count: 0 },
    { range: "5-10 min", max: 600, count: 0 },
    { range: "10-15 min", max: 900, count: 0 },
    { range: "15-20 min", max: 1200, count: 0 },
    { range: "> 20 min", max: Infinity, count: 0 },
  ];

  let previousMax = 0;
  for (const bucket of buckets) {
    bucket.count = durations.filter(
      (d) => d > previousMax && d <= bucket.max
    ).length;
    previousMax = bucket.max;
  }

  const total = durations.length || 1; // Avoid division by zero

  return buckets.map((b) => ({
    range: b.range,
    count: b.count,
    percentage: Math.round((b.count / total) * 100),
  }));
}
