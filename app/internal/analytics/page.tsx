import React from "react";
import {
  TrendingUp,
  Clock,
  MousePointerClick,
  AlertTriangle,
  Users,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Dummy data - replace with real data from API/database later
const DUMMY_DATA = {
  totalFlowStarts: 156,
  totalCompletions: 42,
  completionRate: 26.9, // (42/156) * 100
  avgTimeToComplete: 847, // seconds (14 min 7 sec)
  medianTimeToComplete: 720, // seconds (12 min)
  rageClickSessions: 23,
  totalSessions: 156,
  rageClickRate: 14.7, // (23/156) * 100
  funnelSteps: [
    { step: "Flow Started", users: 156, dropOff: 0, rate: 100 },
    { step: "Step 1: Cover Details", users: 132, dropOff: 24, rate: 84.6 },
    {
      step: "Step 2: Impact Details",
      users: 108,
      dropOff: 24,
      rate: 69.2,
    },
    { step: "Step 3: Site Details", users: 89, dropOff: 19, rate: 57.1 },
    { step: "Step 4: Review", users: 67, dropOff: 22, rate: 42.9 },
    { step: "Step 5: Submit", users: 42, dropOff: 25, rate: 26.9 },
  ],
  timeDistribution: [
    { range: "< 5 min", count: 8, percentage: 19 },
    { range: "5-10 min", count: 15, percentage: 36 },
    { range: "10-15 min", count: 12, percentage: 29 },
    { range: "15-20 min", count: 5, percentage: 12 },
    { range: "> 20 min", count: 2, percentage: 5 },
  ],
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs}s`;
};

const AnalyticsPage = () => {
  const highestDropOff = DUMMY_DATA.funnelSteps.reduce((max, step) =>
    step.dropOff > max.dropOff ? step : max
  );

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
          <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> This dashboard currently displays dummy data
              for visualization purposes. Real-time data integration coming soon.
            </p>
          </div>
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
                {DUMMY_DATA.completionRate.toFixed(1)}%
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {DUMMY_DATA.totalCompletions} of {DUMMY_DATA.totalFlowStarts}{" "}
                users completed
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
                {formatTime(DUMMY_DATA.avgTimeToComplete)}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Median: {formatTime(DUMMY_DATA.medianTimeToComplete)}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  For successful completions
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Rage Clicks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rage Click Sessions
              </CardTitle>
              <MousePointerClick className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {DUMMY_DATA.rageClickRate.toFixed(1)}%
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {DUMMY_DATA.rageClickSessions} of {DUMMY_DATA.totalSessions}{" "}
                sessions
              </p>
              <div className="mt-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-xs text-red-600 font-medium">
                  Needs attention
                </span>
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
                {highestDropOff.dropOff} users abandoned ({" "}
                {((highestDropOff.dropOff / DUMMY_DATA.totalFlowStarts) * 100).toFixed(
                  1
                )}
                %)
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
            <div className="space-y-4">
              {DUMMY_DATA.funnelSteps.map((step, index) => {
                const isHighestDropOff = step.dropOff === highestDropOff.dropOff;
                const barWidth = (step.users / DUMMY_DATA.totalFlowStarts) * 100;

                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0
                              ? "bg-blue-100 text-blue-600"
                              : index === DUMMY_DATA.funnelSteps.length - 1
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
                            {isHighestDropOff && " ⚠️"}
                          </p>
                          <p className="text-xs">
                            (
                            {(
                              (step.dropOff / DUMMY_DATA.funnelSteps[index - 1].users) *
                              100
                            ).toFixed(1)}
                            % of previous)
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="relative h-10 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          index === 0
                            ? "bg-blue-500"
                            : index === DUMMY_DATA.funnelSteps.length - 1
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
            <div className="space-y-3">
              {DUMMY_DATA.timeDistribution.map((item, index) => (
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
