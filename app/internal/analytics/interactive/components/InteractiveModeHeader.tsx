'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { CardConfig } from '../hooks';
import styles from './InteractiveMode.module.css';

interface InteractiveModeHeaderProps {
    cards: CardConfig[];
    currentCard: number;
    onCardClick: (index: number) => void;
    // Music controls
    isMuted?: boolean;
    onToggleMute?: () => void;
    onStartMusic?: () => void;
    isPlaying?: boolean;
}

export default function InteractiveModeHeader({
    cards,
    currentCard,
    onCardClick,
    isMuted = false,
    onToggleMute,
    onStartMusic,
    isPlaying = false,
}: InteractiveModeHeaderProps): React.ReactElement {
    const handleMusicClick = () => {
        if (!isPlaying && onStartMusic) {
            onStartMusic();
        } else if (onToggleMute) {
            onToggleMute();
        }
    };

    return (
        <header className={styles.header}>
            {/* Instagram-style progress bars */}
            <div className={styles.progressBars}>
                {cards.map((card, index) => {
                    const isCompleted = index < currentCard;
                    const isCurrent = index === currentCard;
                    return (
                        <button
                            key={card.id}
                            type="button"
                            className={styles.progressBarWrapper}
                            onClick={() => onCardClick(index)}
                            aria-label={`Go to card ${index + 1}`}
                        >
                            <div className={styles.progressBar}>
                                <motion.div
                                    className={styles.progressBarFill}
                                    initial={false}
                                    animate={{ width: isCompleted || isCurrent ? '100%' : '0%' }}
                                    transition={{ duration: isCurrent ? 0.3 : 0, ease: 'easeOut' }}
                                />
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Navigation row */}
            <div className={styles.headerNav}>
                <div className={styles.headerLeft}>
                    <Link href="/internal/analytics">
                        <button
                            className={styles.exitButton}
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </Link>
                </div>
                <div className={styles.logoCenter}>
                    <span className={styles.logo}>
                        📊 Bumicert Analytics
                    </span>
                </div>
                <div className={styles.headerRight}>
                    {/* Music toggle button */}
                    <motion.button
                        className={styles.exitButton}
                        onClick={handleMusicClick}
                        aria-label={isMuted ? 'Unmute music' : 'Mute music'}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        animate={!isPlaying ? { scale: [1, 1.1, 1] } : {}}
                        transition={!isPlaying ? { repeat: Infinity, duration: 2 } : {}}
                    >
                        {!isPlaying ? '🔊' : isMuted ? '🔇' : '🔊'}
                    </motion.button>
                </div>
            </div>
        </header>
    );
}
