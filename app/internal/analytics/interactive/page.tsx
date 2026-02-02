'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useCardNavigation, useBackgroundMusic } from './hooks';
import type { CardConfig } from './hooks';
import type { AnalyticsData } from './components/types';
import { CARD_THEMES, cardVariants } from './components/interactiveTheme';
import InteractiveModeBackground from './components/InteractiveModeBackground';
import InteractiveModeHeader from './components/InteractiveModeHeader';
import styles from './components/InteractiveMode.module.css';

// Card components
import CardWelcome from './components/cards/CardWelcome';
import CardCompletionRate from './components/cards/CardCompletionRate';
import CardTimeMetrics from './components/cards/CardTimeMetrics';
import CardFlowStarts from './components/cards/CardFlowStarts';
import CardFunnelAnalysis from './components/cards/CardFunnelAnalysis';
import CardDraftAnalytics from './components/cards/CardDraftAnalytics';
import CardTimeDistribution from './components/cards/CardTimeDistribution';
import CardSummary from './components/cards/CardSummary';

// Fetch analytics data (same pattern as dashboard)
const fetchAnalyticsData = async (): Promise<AnalyticsData> => {
    let baseUrl: string;

    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
        baseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    } else if (process.env.NEXT_PUBLIC_APP_URL) {
        baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    } else {
        baseUrl = window.location.origin;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
        const response = await fetch(`${baseUrl}/api/analytics/stats`, {
            cache: 'no-store',
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timed out after 15 seconds');
        }
        throw error;
    }
};

// Default empty data
const defaultData: AnalyticsData = {
    totalFlowStarts: 0,
    totalCompletions: 0,
    completionRate: 0,
    avgTimeToComplete: 0,
    medianTimeToComplete: 0,
    funnelSteps: [],
    timeDistribution: [],
    lastUpdated: new Date().toISOString(),
    totalDraftsSaved: 0,
    totalDraftsResumed: 0,
    draftSaveRate: 0,
    avgDaysBeforeResume: 0,
};

// Card ID to theme mapping
const CARD_IDS = [
    'welcome',
    'completion-rate',
    'time-metrics',
    'flow-starts',
    'funnel-analysis',
    'draft-analytics',
    'time-distribution',
    'summary',
] as const;

export default function InteractiveModePage(): React.ReactElement {
    const [data, setData] = useState<AnalyticsData>(defaultData);
    const [isLoading, setIsLoading] = useState(true);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    // Detect touch device
    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    // Fetch data on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await fetchAnalyticsData();
                setData(result);
            } catch (error) {
                console.error('Failed to load analytics data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // Define card configurations
    const cards: CardConfig[] = useMemo(() => [
        { id: 'welcome', component: CardWelcome },
        { id: 'completion-rate', component: CardCompletionRate },
        { id: 'time-metrics', component: CardTimeMetrics },
        { id: 'flow-starts', component: CardFlowStarts },
        { id: 'funnel-analysis', component: CardFunnelAnalysis },
        { id: 'draft-analytics', component: CardDraftAnalytics },
        { id: 'time-distribution', component: CardTimeDistribution },
        { id: 'summary', component: CardSummary },
    ], []);

    // Navigation hook
    const {
        currentCard,
        currentSubcard,
        direction,
        goNext,
        goPrev,
        goToCard,
    } = useCardNavigation(cards);

    // Get current theme
    const currentCardId = CARD_IDS[currentCard] || 'welcome';
    const currentTheme = CARD_THEMES[currentCardId] || CARD_THEMES.welcome;

    // Background music hook
    const {
        startMusic,
        isMuted,
        isPlaying,
        toggleMute,
    } = useBackgroundMusic(currentCardId);

    // Handle click navigation
    const handleCardClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const midpoint = rect.width / 2;

        if (clickX < midpoint) {
            goPrev();
        } else {
            goNext();
        }
    }, [goNext, goPrev]);

    // Get direction value for animation
    const directionValue = direction === 'next' ? 1 : -1;

    // Render current card
    const CurrentCardComponent = cards[currentCard]?.component;

    return (
        <div
            className={styles.interactiveContainer}
            style={{ background: currentTheme.bgColor }}
        >
            {/* Animated background */}
            <InteractiveModeBackground theme={currentTheme} />

            {/* Header with progress bars */}
            <InteractiveModeHeader
                cards={cards}
                currentCard={currentCard}
                onCardClick={goToCard}
                isMuted={isMuted}
                onToggleMute={toggleMute}
                onStartMusic={startMusic}
                isPlaying={isPlaying}
            />

            {/* Cards wrapper */}
            <div
                className={styles.cardsWrapper}
                onClick={handleCardClick}
                role="button"
                tabIndex={0}
                aria-label="Navigate cards by clicking left or right"
            >
                <AnimatePresence initial={false} custom={directionValue} mode="popLayout">
                    <motion.div
                        key={currentCard}
                        custom={directionValue}
                        variants={cardVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: 'spring', stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                            rotate: { duration: 0.4 },
                            scale: { duration: 0.4 },
                        }}
                        className={styles.card}
                    >
                        <div className={styles.cardInner}>
                            {CurrentCardComponent && (
                                <CurrentCardComponent
                                    data={data}
                                    isActive
                                    subcard={currentSubcard}
                                    isTouchDevice={isTouchDevice}
                                    isLoading={isLoading}
                                    cardType={currentCardId}
                                />
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
