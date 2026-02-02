'use client';

import type { ReactElement } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import { useAnimatedNumber } from '../../hooks';
import styles from '../InteractiveMode.module.css';
import type { BaseCardProps } from '../types';

export default function CardCompletionRate({ data, isActive }: BaseCardProps): ReactElement {
    const animatedRate = useAnimatedNumber(
        Math.round(data.completionRate * 10) / 10,
        { delay: 500, duration: 1200, enabled: isActive }
    );
    const animatedCompletions = useAnimatedNumber(data.totalCompletions, { delay: 800, enabled: isActive });
    const animatedStarts = useAnimatedNumber(data.totalFlowStarts, { delay: 1000, enabled: isActive });

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
                    <span className={styles.headlineSmall}>Task Completion</span>
                </motion.div>
                <motion.div
                    className={styles.headlineRow}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <span className={styles.headlineBig}>{animatedRate.toFixed(1)}%</span>
                </motion.div>
                <motion.div
                    className={styles.headlineRow}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <span className={styles.headlineMedium}>RATE</span>
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

            {/* Stats badges */}
            <motion.div
                className={styles.badgeGroup}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
            >
                <div className={styles.badge}>
                    <span className={styles.badgeValue}>{animatedCompletions}</span>
                    <span className={styles.badgeLabel}>Completed</span>
                </div>
                <div className={styles.badge}>
                    <span className={styles.badgeValue}>{animatedStarts}</span>
                    <span className={styles.badgeLabel}>Started</span>
                </div>
            </motion.div>

            {/* Target banner */}
            <motion.div
                className={styles.celebrationBanner}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8 }}
            >
                <span className={styles.bannerPre}>Target</span>
                <div className={styles.bannerMain}>40%</div>
                <span className={styles.bannerPost}>completion rate goal</span>
            </motion.div>
        </div>
    );
}
