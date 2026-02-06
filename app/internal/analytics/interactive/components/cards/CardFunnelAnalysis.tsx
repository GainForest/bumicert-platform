'use client';

import type { ReactElement } from 'react';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from '../InteractiveMode.module.css';
import type { BaseCardProps } from '../types';
import { PALETTE } from '../interactiveTheme';

export default function CardFunnelAnalysis({ data, isActive }: BaseCardProps): ReactElement {
    const highestDropOff = useMemo(() => {
        if (data.funnelSteps.length === 0) return { step: 'N/A', dropOff: 0 };
        return data.funnelSteps.reduce((max, step) =>
            step.dropOff > max.dropOff ? step : max
        );
    }, [data.funnelSteps]);

    const hasData = data.funnelSteps.length > 0;

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
                    <span className={styles.headlineSmall}>Conversion</span>
                </motion.div>
                <motion.div
                    className={styles.headlineRow}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                >
                    <span className={styles.headlineMedium}>FUNNEL ANALYSIS</span>
                </motion.div>
            </div>

            {/* Funnel Steps */}
            {hasData ? (
                <motion.div
                    style={{ width: '100%', maxWidth: '400px', marginTop: '1rem' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    {data.funnelSteps.map((step, index) => {
                        const isHighest = step.dropOff === highestDropOff.dropOff && step.dropOff > 0;
                        const barWidth = data.totalFlowStarts > 0 ? (step.users / data.totalFlowStarts) * 100 : 0;

                        // Color based on position
                        let barColor = PALETTE.muted;
                        if (index === 0) barColor = PALETTE.chart2Teal;
                        else if (index === data.funnelSteps.length - 1) barColor = PALETTE.primary;

                        return (
                            <motion.div
                                key={step.step}
                                className={styles.funnelStep}
                                initial={{ opacity: 0, x: -20 }}
                                animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                transition={{ delay: 0.8 + index * 0.15 }}
                            >
                                <div
                                    className={styles.funnelStepNumber}
                                    style={{
                                        background: index === 0
                                            ? PALETTE.chart2Teal
                                            : index === data.funnelSteps.length - 1
                                                ? PALETTE.primary
                                                : 'var(--bumi-white-20)',
                                        color: index === 0 || index === data.funnelSteps.length - 1
                                            ? PALETTE.background
                                            : PALETTE.white,
                                    }}
                                >
                                    {index + 1}
                                </div>
                                <div className={styles.funnelStepContent}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className={styles.funnelStepName}>{step.step}</span>
                                        {step.dropOff > 0 && (
                                            <span
                                                className={`${styles.funnelDropOff} ${isHighest ? styles.funnelDropOffHighlight : ''}`}
                                                style={{ color: isHighest ? PALETTE.chart5Red : 'var(--bumi-white-60)' }}
                                            >
                                                -{step.dropOff} dropped{isHighest && ' !!'}
                                            </span>
                                        )}
                                    </div>
                                    <span className={styles.funnelStepMeta}>
                                        {step.users} users ({step.rate.toFixed(1)}%)
                                    </span>
                                    <div className={styles.funnelBar}>
                                        <motion.div
                                            className={styles.funnelBarFill}
                                            style={{ background: barColor }}
                                            initial={{ width: 0 }}
                                            animate={isActive ? { width: `${barWidth}%` } : { width: 0 }}
                                            transition={{ delay: 1 + index * 0.15, duration: 0.6 }}
                                        >
                                            {barWidth > 15 && `${step.users}`}
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            ) : (
                <motion.p
                    style={{ color: 'var(--bumi-white-60)', textAlign: 'center', marginTop: '2rem' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    No funnel data available yet
                </motion.p>
            )}
        </div>
    );
}
