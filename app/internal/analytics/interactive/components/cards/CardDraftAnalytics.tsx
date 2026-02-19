'use client';

import type { ReactElement } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import { useAnimatedNumber } from '../../hooks';
import styles from '../InteractiveMode.module.css';
import type { BaseCardProps } from '../types';

export default function CardDraftAnalytics({ data, isActive }: BaseCardProps): ReactElement {
    const animatedSaves = useAnimatedNumber(data.totalDraftsSaved, { delay: 600, duration: 1200, enabled: isActive });
    const animatedResumes = useAnimatedNumber(data.totalDraftsResumed, { delay: 800, duration: 1200, enabled: isActive });

    const resumeRate = data.totalDraftsSaved > 0
        ? Math.min((data.totalDraftsResumed / data.totalDraftsSaved) * 100, 100)
        : 0;

    const maxValue = Math.max(data.totalDraftsSaved, data.totalDraftsResumed, 1);
    const savesHeight = 40 + (data.totalDraftsSaved / maxValue) * 100;
    const resumesHeight = 40 + (data.totalDraftsResumed / maxValue) * 100;

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
                    <span className={styles.headlineSmall}>Draft</span>
                </motion.div>
                <motion.div
                    className={styles.headlineRow}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                >
                    <span className={styles.headlineMedium}>ANALYTICS</span>
                </motion.div>
            </div>

            {/* Pillars */}
            <motion.div
                className={styles.pillarsContainer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
            >
                {/* Saves pillar */}
                <div className={styles.pillar}>
                    <motion.div
                        className={`${styles.pillarBar} ${styles.pillarSaves}`}
                        initial={{ height: 40 }}
                        animate={isActive ? { height: savesHeight } : { height: 40 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                    >
                        <span className={styles.pillarValue}>{animatedSaves}</span>
                    </motion.div>
                    <span className={styles.pillarLabel}>Drafts Saved</span>
                </div>

                {/* Resumes pillar */}
                <div className={styles.pillar}>
                    <motion.div
                        className={`${styles.pillarBar} ${styles.pillarResumes}`}
                        initial={{ height: 40 }}
                        animate={isActive ? { height: resumesHeight } : { height: 40 }}
                        transition={{ delay: 1.1, duration: 0.8 }}
                    >
                        <span className={styles.pillarValue}>{animatedResumes}</span>
                    </motion.div>
                    <span className={styles.pillarLabel}>Drafts Resumed</span>
                </div>
            </motion.div>

            {/* Resume rate progress bar */}
            {data.totalDraftsSaved > 0 && (
                <motion.div
                    style={{
                        width: '100%',
                        maxWidth: '280px',
                        marginTop: '1.5rem',
                        padding: '1rem',
                        background: 'var(--bumi-white-10)',
                        borderRadius: '12px',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--bumi-white-80)' }}>
                            Resume Rate
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--bumi-primary-light)' }}>
                            {resumeRate.toFixed(1)}%
                        </span>
                    </div>
                    <div style={{ height: '8px', background: 'var(--bumi-white-20)', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div
                            style={{ height: '100%', background: 'var(--bumi-primary)', borderRadius: '4px' }}
                            initial={{ width: 0 }}
                            animate={isActive ? { width: `${resumeRate}%` } : { width: 0 }}
                            transition={{ delay: 1.6, duration: 0.8 }}
                        />
                    </div>
                </motion.div>
            )}

            {/* Avg days badge */}
            {data.totalDraftsResumed > 0 && (
                <motion.div
                    className={styles.badgeGroup}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 }}
                >
                    <div className={styles.badge}>
                        <span className={styles.badgeValue}>
                            {data.avgDaysBeforeResume > 0 ? `${data.avgDaysBeforeResume.toFixed(1)}d` : '< 1d'}
                        </span>
                        <span className={styles.badgeLabel}>Avg Days to Resume</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
