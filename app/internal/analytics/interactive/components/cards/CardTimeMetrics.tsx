'use client';

import type { ReactElement } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import { useAnimatedNumber } from '../../hooks';
import styles from '../InteractiveMode.module.css';
import type { BaseCardProps } from '../types';

const formatTime = (seconds: number): { minutes: number; secs: number } => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return { minutes, secs };
};

export default function CardTimeMetrics({ data, isActive }: BaseCardProps): ReactElement {
    const avgTime = formatTime(data.avgTimeToComplete);
    const medianTime = formatTime(data.medianTimeToComplete);

    const animatedMinutes = useAnimatedNumber(avgTime.minutes, { delay: 500, duration: 1200, enabled: isActive });
    const animatedSeconds = useAnimatedNumber(avgTime.secs, { delay: 700, duration: 1000, enabled: isActive });

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
                    <span className={styles.headlineSmall}>Average Time</span>
                </motion.div>
                <motion.div
                    className={styles.headlineRow}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                >
                    <span className={styles.headlineBig}>
                        {animatedMinutes}m {animatedSeconds}s
                    </span>
                </motion.div>
                <motion.div
                    className={styles.headlineRow}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <span className={styles.headlineMedium}>TO COMPLETE</span>
                </motion.div>
            </div>

            {/* Divider */}
            <motion.div
                className={styles.divider}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 1.1 }}
            >
                <div className={styles.dividerLine} />
                <span className={styles.dividerDiamond}>◆</span>
                <div className={styles.dividerLine} />
            </motion.div>

            {/* Median badge */}
            <motion.div
                className={styles.badgeGroup}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
            >
                <div className={styles.badge}>
                    <span className={styles.badgeValue}>
                        {medianTime.minutes}m {medianTime.secs}s
                    </span>
                    <span className={styles.badgeLabel}>Median Time</span>
                </div>
            </motion.div>

            {/* Context note */}
            <motion.p
                style={{
                    fontSize: '0.85rem',
                    color: 'var(--bumi-white-60)',
                    textAlign: 'center',
                    marginTop: '1.5rem',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
            >
                For successful completions only
            </motion.p>
        </div>
    );
}
