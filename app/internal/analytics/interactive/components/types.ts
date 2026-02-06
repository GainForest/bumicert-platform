// Shared types for Interactive Mode card components

// Analytics data type (matches dashboard API)
export interface AnalyticsData {
    totalFlowStarts: number;
    totalCompletions: number;
    completionRate: number;
    avgTimeToComplete: number;
    medianTimeToComplete: number;
    funnelSteps: FunnelStep[];
    timeDistribution: TimeDistribution[];
    lastUpdated: string;
    // Draft analytics
    totalDraftsSaved: number;
    totalDraftsResumed: number;
    draftSaveRate: number;
    avgDaysBeforeResume: number;
}

export interface FunnelStep {
    step: string;
    users: number;
    dropOff: number;
    rate: number;
}

export interface TimeDistribution {
    range: string;
    count: number;
    percentage: number;
}

// Base props for all card components
export interface BaseCardProps {
    data: AnalyticsData;
    isActive: boolean;
    subcard?: number;
    isTouchDevice?: boolean;
    isLoading?: boolean;
    cardType?: string;
}
