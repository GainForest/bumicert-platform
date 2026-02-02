'use client';

import type { ReactElement } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAnimatedNumber } from '../../hooks';
import styles from '../InteractiveMode.module.css';
import type { BaseCardProps } from '../types';

const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
};

export default function CardSummary({ data, isActive }: BaseCardProps): ReactElement {
    const animatedStarts = useAnimatedNumber(data.totalFlowStarts, { delay: 800, duration: 1000, enabled: isActive });
    const animatedCompletions = useAnimatedNumber(data.totalCompletions, { delay: 1000, duration: 1000, enabled: isActive });

    return (
        <div className={styles.cardContent}>
            {/* Headline */}
            <div className={styles.headlineStack}>
                <motion.div
                    className={styles.headlineRow}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <span className={styles.headlineSmall}>Your</span>
                </motion.div>
                <motion.div
                    className={styles.headlineRow}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                >
                    <span className={styles.headlineMedium}>ANALYTICS SUMMARY</span>
                </motion.div>
            </div>

            {/* Summary grid */}
            <motion.div
                className={styles.summaryGrid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <div className={styles.summaryItem}>
                    <span className={styles.summaryValue}>{animatedStarts}</span>
                    <span className={styles.summaryLabel}>Flow Starts</span>
                </div>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryValue}>{animatedCompletions}</span>
                    <span className={styles.summaryLabel}>Completions</span>
                </div>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryValue}>{data.completionRate.toFixed(1)}%</span>
                    <span className={styles.summaryLabel}>Completion Rate</span>
                </div>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryValue}>{formatTime(data.avgTimeToComplete)}</span>
                    <span className={styles.summaryLabel}>Avg Time</span>
                </div>
            </motion.div>

            {/* Thank you message */}
            <motion.div
                style={{ textAlign: 'center', marginTop: '1.5rem' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
            >
                <p style={{ fontSize: '1rem', color: 'var(--bumi-white-80)', marginBottom: '0.5rem' }}>
                    Thanks for exploring your metrics!
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--bumi-white-60)' }}>
                    Last updated: {new Date(data.lastUpdated).toLocaleDateString()}
                </p>
            </motion.div>

            {/* Exit button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
            >
                <Link href="/internal/analytics">
                    <motion.button
                        className={`${styles.exitButton} ${styles.large}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Return to Dashboard
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
}
