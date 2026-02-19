'use client';

import type { ReactElement } from 'react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '../InteractiveMode.module.css';
import type { BaseCardProps } from '../types';

const TITLE_START = 0.3;
const TAGLINE_DELAY = 1.0;
const INSTRUCTIONS_DELAY = 1.5;
const CTA_DELAY = 2.0;

export default function CardWelcome({
    isTouchDevice,
    isLoading,
}: BaseCardProps): ReactElement {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: tracking mount state for animations
        setIsMounted(true);
    }, []);

    const hidden = { opacity: 0, y: 20 };
    const visible = { opacity: 1, y: 0 };

    return (
        <div className={styles.cardContent}>
            <div className={styles.headlineStack}>
                <motion.div
                    className={styles.headlineRow}
                    initial={hidden}
                    animate={isMounted ? visible : hidden}
                    transition={{ delay: TITLE_START, type: 'spring', stiffness: 100 }}
                >
                    <span className={styles.headlineSmall}>Welcome to</span>
                </motion.div>
                <motion.div
                    className={styles.headlineRow}
                    initial={hidden}
                    animate={isMounted ? visible : hidden}
                    transition={{ delay: TITLE_START + 0.15, type: 'spring', stiffness: 100 }}
                >
                    <span className={styles.headlineMedium}>BUMICERT</span>
                </motion.div>
                <motion.div
                    className={styles.headlineRow}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={isMounted ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                    transition={{ delay: TITLE_START + 0.3, type: 'spring', stiffness: 200, damping: 15 }}
                >
                    <span className={styles.headlineBig}>ANALYTICS</span>
                </motion.div>
            </div>

            <motion.p
                className={styles.welcomeTagline}
                initial={hidden}
                animate={isMounted ? visible : hidden}
                transition={{ delay: TAGLINE_DELAY, duration: 0.5 }}
            >
                Your metrics journey awaits.
            </motion.p>

            <motion.p
                className={styles.welcomeInstructions}
                initial={{ opacity: 0 }}
                animate={{ opacity: isMounted ? 1 : 0 }}
                transition={{ delay: INSTRUCTIONS_DELAY, duration: 0.5 }}
            >
                {isTouchDevice ? 'Tap' : 'Click'} the sides to navigate
                <span className={styles.instructionHint}>👈 back · next 👉</span>
            </motion.p>

            <motion.div
                className={styles.welcomeCta}
                initial={{ opacity: 0 }}
                animate={{ opacity: isMounted ? 1 : 0 }}
                transition={{ delay: CTA_DELAY, duration: 0.5 }}
            >
                {isLoading ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.loadingSpinner} />
                        <span className={styles.loadingText}>Loading your metrics...</span>
                    </div>
                ) : (
                    <motion.div
                        className={styles.readyState}
                        animate={{ x: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    >
                        <span className={styles.ctaText}>
                            {isTouchDevice ? 'Tap' : 'Click'} right to begin →
                        </span>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
