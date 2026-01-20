import React from "react";
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  Users,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

type AnalyticsData = {
  totalFlowStarts: number;
  totalCompletions: number;
  completionRate: number;
  avgTimeToComplete: number;
  medianTimeToComplete: number;
  funnelSteps: FunnelStep[];
  timeDistribution: TimeDistribution[];
  lastUpdated: string;
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs}s`;
};

const formatLastUpdated = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const fetchAnalyticsData = async (): Promise<AnalyticsData> => {
  // Construct the full URL for the API endpoint
  // Priority: VERCEL_URL (preview deploys) > NEXT_PUBLIC_APP_URL > localhost
  let baseUrl: string;
  
  if (process.env.VERCEL_URL) {
    // Vercel preview/production deployment
    baseUrl = `https://${process.env.VERCEL_URL}`;
  } else if (process.env.NEXT_PUBLIC_APP_URL) {
    baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  } else {
    baseUrl = "http://localhost:3000";
  }
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

  try {
    const response = await fetch(`${baseUrl}/api/analytics/stats`, {
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out after 15 seconds");
    }
    throw error;
  }
};

const AnalyticsPage = async () => {
  let data: AnalyticsData;
  let fetchError = false;

  try {
    data = await fetchAnalyticsData();
  } catch {
    fetchError = true;
    // Fallback to empty data structure
    data = {
      totalFlowStarts: 0,
      totalCompletions: 0,
      completionRate: 0,
      avgTimeToComplete: 0,
      medianTimeToComplete: 0,
      funnelSteps: [],
      timeDistribution: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  const highestDropOff =
    data.funnelSteps.length > 0
      ? data.funnelSteps.reduce((max, step) =>
          step.dropOff > max.dropOff ? step : max
        )
      : { step: "N/A", dropOff: 0 };

  const hasData = data.totalFlowStarts > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bumicert Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track user behavior and conversion metrics for the Bumicert creation
            flow
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <RefreshCw className="h-4 w-4" />
            <span>Last updated: {formatLastUpdated(data.lastUpdated)}</span>
          </div>
          {fetchError && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-200">
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                <strong>Error:</strong> Failed to fetch analytics data. Please
                refresh the page or check the API connection.
              </p>
            </div>
          )}
          {!hasData && !fetchError && (
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> No analytics data recorded yet. Data will
                appear here once users start the Bumicert creation flow.
              </p>
            </div>
          )}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Task Completion Rate */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Task Completion Rate
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {data.completionRate.toFixed(1)}%
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {data.totalCompletions} of {data.totalFlowStarts} users completed
              </p>
              <div className="mt-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-600 font-medium">
                  Target: 40%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Average Time to Complete */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Time to Complete
              </CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {hasData ? formatTime(data.avgTimeToComplete) : "N/A"}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Median:{" "}
                {hasData ? formatTime(data.medianTimeToComplete) : "N/A"}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  For successful completions
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Total Flow Starts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Flow Starts
              </CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {data.totalFlowStarts}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Users who clicked &quot;Get Started&quot;
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-gray-500">All time</span>
              </div>
            </CardContent>
          </Card>

          {/* Highest Drop-off Point */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Highest Drop-off
              </CardTitle>
              <XCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-orange-600">
                {highestDropOff.step}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {highestDropOff.dropOff} users abandoned
                {data.totalFlowStarts > 0 &&
                  ` (${((highestDropOff.dropOff / data.totalFlowStarts) * 100).toFixed(1)}%)`}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-gray-500">Critical point</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Funnel Visualization */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Conversion Funnel - Drop-off Analysis
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track where users abandon the Bumicert creation process
            </p>
          </CardHeader>
          <CardContent>
            {data.funnelSteps.length > 0 ? (
              <div className="space-y-4">
                {data.funnelSteps.map((step, index) => {
                  const isHighestDropOff =
                    step.dropOff === highestDropOff.dropOff &&
                    step.dropOff > 0;
                  const barWidth =
                    data.totalFlowStarts > 0
                      ? (step.users / data.totalFlowStarts) * 100
                      : 0;

                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0
                                ? "bg-blue-100 text-blue-600"
                                : index === data.funnelSteps.length - 1
                                  ? "bg-green-100 text-green-600"
                                  : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {step.step}
                            </p>
                            <p className="text-xs text-gray-500">
                              {step.users} users ({step.rate.toFixed(1)}%)
                            </p>
                          </div>
                        </div>
                        {step.dropOff > 0 && (
                          <div
                            className={`text-right ${isHighestDropOff ? "text-red-600 font-bold" : "text-gray-600"}`}
                          >
                            <p className="text-sm">
                              -{step.dropOff} dropped
                              {isHighestDropOff && " !!"}
                            </p>
                            {index > 0 && data.funnelSteps[index - 1].users > 0 && (
                              <p className="text-xs">
                                (
                                {(
                                  (step.dropOff /
                                    data.funnelSteps[index - 1].users) *
                                  100
                                ).toFixed(1)}
                                % of previous)
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="relative h-10 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            index === 0
                              ? "bg-blue-500"
                              : index === data.funnelSteps.length - 1
                                ? "bg-green-500"
                                : "bg-gray-400"
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-900 dark:text-white">
                          {step.users} users
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No funnel data available yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Completion Time Distribution
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              How long users take to complete the flow (successful completions
              only)
            </p>
          </CardHeader>
          <CardContent>
            {data.timeDistribution.length > 0 ? (
              <div className="space-y-3">
                {data.timeDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.range}
                    </div>
                    <div className="flex-1">
                      <div className="relative h-8 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                        <div className="absolute inset-0 flex items-center px-3 text-sm font-medium text-gray-900 dark:text-white">
                          {item.count} users ({item.percentage}%)
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No completion time data available yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
