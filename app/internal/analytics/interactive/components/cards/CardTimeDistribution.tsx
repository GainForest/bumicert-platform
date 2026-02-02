'use client';

import type { ReactElement } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import styles from '../InteractiveMode.module.css';
import type { BaseCardProps } from '../types';

export default function CardTimeDistribution({ data, isActive }: BaseCardProps): ReactElement {
    const hasData = data.timeDistribution.length > 0;

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
                    <span className={styles.headlineSmall}>Completion Time</span>
                </motion.div>
                <motion.div
                    className={styles.headlineRow}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                >
                    <span className={styles.headlineMedium}>DISTRIBUTION</span>
                </motion.div>
            </div>

            {/* Time distribution bars */}
            {hasData ? (
                <motion.div
                    style={{ width: '100%', maxWidth: '400px', marginTop: '1.5rem' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    {data.timeDistribution.map((item, index) => (
                        <motion.div
                            key={item.range}
                            className={styles.timeDistItem}
                            initial={{ opacity: 0, x: -20 }}
                            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ delay: 0.8 + index * 0.12 }}
                        >
                            <span className={styles.timeDistLabel}>{item.range}</span>
                            <div className={styles.timeDistBarWrapper}>
                                <motion.div
                                    className={styles.timeDistBar}
                                    initial={{ width: 0 }}
                                    animate={isActive ? { width: `${Math.max(item.percentage, 5)}%` } : { width: 0 }}
                                    transition={{ delay: 1 + index * 0.12, duration: 0.6 }}
                                />
                                <span className={styles.timeDistValue}>
                                    {item.count} ({item.percentage}%)
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.p
                    style={{ color: 'var(--bumi-white-60)', textAlign: 'center', marginTop: '2rem' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    No completion time data available yet
                </motion.p>
            )}

            {/* Note */}
            <motion.p
                style={{
                    fontSize: '0.75rem',
                    color: 'var(--bumi-white-40)',
                    textAlign: 'center',
                    marginTop: '1.5rem',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
            >
                Successful completions only
            </motion.p>
        </div>
    );
}
