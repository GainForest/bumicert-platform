'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { CardTheme } from './interactiveTheme';
import { STAR_POSITIONS } from './interactiveTheme';
import styles from './InteractiveMode.module.css';

interface InteractiveModeBackgroundProps {
    theme: CardTheme;
}

export default function InteractiveModeBackground({ theme }: InteractiveModeBackgroundProps): React.ReactElement {
    return (
        <>
            {/* Background effects - animated burst color */}
            <motion.div
                className={styles.backgroundBurst}
                animate={{
                    background: `repeating-conic-gradient(
            from 0deg at 50% 50%,
            ${theme.bgColor} 0deg 10deg,
            ${theme.burstColor} 10deg 20deg
          )`,
                }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
            />

            {/* Decorative stars */}
            <div className={styles.decorations}>
                {STAR_POSITIONS.map((pos, i) => {
                    const decoration = theme.decorations[i];
                    const positionKey = `${pos.top || ''}-${pos.bottom || ''}-${pos.left || ''}-${pos.right || ''}-${pos.size}`;
                    return (
                        <motion.div
                            key={`star-${positionKey}`}
                            className={styles.star}
                            style={{
                                top: pos.top,
                                left: pos.left,
                                right: pos.right,
                                bottom: pos.bottom,
                                fontSize: pos.size,
                            }}
                            animate={{
                                y: [0, -15, 0],
                                rotate: [0, 10, -5, 0],
                                color: decoration.color,
                            }}
                            transition={{
                                y: { duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: pos.delay },
                                rotate: { duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: pos.delay },
                                color: { duration: 0.5, ease: 'easeInOut' },
                            }}
                        >
                            {decoration.char}
                        </motion.div>
                    );
                })}
            </div>
        </>
    );
}
