'use client';

import type { ReactElement } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import { useAnimatedNumber } from '../../hooks';
import styles from '../InteractiveMode.module.css';
import type { BaseCardProps } from '../types';

export default function CardFlowStarts({ data, isActive }: BaseCardProps): ReactElement {
    const animatedStarts = useAnimatedNumber(data.totalFlowStarts, { delay: 500, duration: 1500, enabled: isActive });

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
                    <span className={styles.headlineSmall}>Total Users</span>
                </motion.div>
                <motion.div
                    className={styles.headlineRow}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                >
                    <span className={styles.headlineBig}>{animatedStarts.toLocaleString()}</span>
                </motion.div>
                <motion.div
                    className={styles.headlineRow}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <span className={styles.headlineMedium}>STARTED THE FLOW</span>
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

            {/* Context */}
            <motion.div
                className={styles.celebrationBanner}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 }}
            >
                <span className={styles.bannerPre}>Users who clicked</span>
                <div className={styles.bannerMain}>&quot;Get Started&quot;</div>
                <span className={styles.bannerPost}>All time</span>
            </motion.div>
        </div>
    );
}
