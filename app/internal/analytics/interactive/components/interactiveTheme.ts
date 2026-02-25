// Interactive Mode - Theme Constants and Configurations
// Using Bumicert Platform color scheme from globals.css

// Card to background music track mapping (1.mp3, 2.mp3, 3.mp3)
// Track 0 = 1.mp3 (intro/welcome mood)
// Track 1 = 2.mp3 (stats/data mood)
// Track 2 = 3.mp3 (summary/conclusion mood)
export const CARD_TO_TRACK: Record<string, number> = {
    'welcome': 0,
    'completion-rate': 0,
    'time-metrics': 0,
    'flow-starts': 1,
    'funnel-analysis': 1,
    'draft-analytics': 1,
    'time-distribution': 2,
    'summary': 2,
};

export interface CardTheme {
    bgColor: string;
    burstColor: string;
    decorations: { char: string; color: string }[];
}

// Bumicert Platform Colors (from globals.css - dark mode)
export const PALETTE = {
    // Backgrounds
    background: 'oklch(0.2 0 0)',
    card: 'oklch(0.21 0.006 285.885)',

    // Primary greens (Bumicert signature)
    primary: 'oklch(0.58 0.0751 159.05)',
    primaryLight: 'oklch(0.696 0.17 162.48)',
    accent: 'oklch(0.34 0.0239 145.03)',
    ring: 'oklch(0.4 0.0717 155.99)',

    // Chart colors for variety
    chart1Purple: 'oklch(0.488 0.243 264.376)',
    chart2Teal: 'oklch(0.696 0.17 162.48)',
    chart3Orange: 'oklch(0.769 0.188 70.08)',
    chart4Magenta: 'oklch(0.627 0.265 303.9)',
    chart5Red: 'oklch(0.645 0.246 16.439)',

    // Text
    white: 'oklch(0.985 0 0)',
    muted: 'oklch(0.705 0.015 286.067)',
    mutedDark: 'oklch(0.552 0.016 285.938)',
};

export const CARD_THEMES: Record<string, CardTheme> = {
    welcome: {
        bgColor: PALETTE.background,
        burstColor: 'rgba(88, 163, 95, 0.08)', // Primary green tint
        decorations: [
            { char: '✦', color: PALETTE.primary },
            { char: '★', color: PALETTE.primaryLight },
            { char: '✶', color: PALETTE.chart2Teal },
            { char: '✦', color: PALETTE.primaryLight },
            { char: '★', color: PALETTE.primary },
            { char: '✶', color: PALETTE.accent },
        ],
    },
    'completion-rate': {
        bgColor: PALETTE.card,
        burstColor: 'rgba(88, 163, 95, 0.1)', // Success green
        decorations: [
            { char: '✦', color: PALETTE.primary },
            { char: '★', color: PALETTE.primaryLight },
            { char: '✶', color: PALETTE.primary },
            { char: '✦', color: PALETTE.chart2Teal },
            { char: '★', color: PALETTE.primaryLight },
            { char: '✶', color: PALETTE.primary },
        ],
    },
    'time-metrics': {
        bgColor: PALETTE.card,
        burstColor: 'rgba(110, 169, 170, 0.08)', // Teal tint
        decorations: [
            { char: '✧', color: PALETTE.chart2Teal },
            { char: '★', color: PALETTE.primaryLight },
            { char: '◇', color: PALETTE.chart2Teal },
            { char: '✦', color: PALETTE.primary },
            { char: '✧', color: PALETTE.white },
            { char: '★', color: PALETTE.chart2Teal },
        ],
    },
    'flow-starts': {
        bgColor: PALETTE.card,
        burstColor: 'rgba(160, 100, 200, 0.08)', // Magenta tint
        decorations: [
            { char: '★', color: PALETTE.chart4Magenta },
            { char: '✦', color: PALETTE.chart1Purple },
            { char: '✶', color: PALETTE.chart4Magenta },
            { char: '★', color: PALETTE.primary },
            { char: '✦', color: PALETTE.chart4Magenta },
            { char: '✶', color: PALETTE.chart1Purple },
        ],
    },
    'funnel-analysis': {
        bgColor: PALETTE.card,
        burstColor: 'rgba(200, 100, 80, 0.08)', // Orange/red tint for warnings
        decorations: [
            { char: '◆', color: PALETTE.chart3Orange },
            { char: '▸', color: PALETTE.chart5Red },
            { char: '✦', color: PALETTE.chart3Orange },
            { char: '◆', color: PALETTE.primary },
            { char: '▸', color: PALETTE.chart3Orange },
            { char: '✶', color: PALETTE.chart5Red },
        ],
    },
    'draft-analytics': {
        bgColor: PALETTE.card,
        burstColor: 'rgba(120, 90, 200, 0.08)', // Purple tint
        decorations: [
            { char: '✶', color: PALETTE.chart1Purple },
            { char: '★', color: PALETTE.primary },
            { char: '✦', color: PALETTE.chart1Purple },
            { char: '✶', color: PALETTE.chart4Magenta },
            { char: '★', color: PALETTE.chart1Purple },
            { char: '✦', color: PALETTE.primary },
        ],
    },
    'time-distribution': {
        bgColor: PALETTE.card,
        burstColor: 'rgba(110, 169, 170, 0.08)', // Teal tint
        decorations: [
            { char: '✧', color: PALETTE.chart2Teal },
            { char: '★', color: PALETTE.primary },
            { char: '✦', color: PALETTE.chart2Teal },
            { char: '✧', color: PALETTE.primaryLight },
            { char: '★', color: PALETTE.chart2Teal },
            { char: '✶', color: PALETTE.primary },
        ],
    },
    summary: {
        bgColor: PALETTE.background,
        burstColor: 'rgba(88, 163, 95, 0.1)', // Primary green
        decorations: [
            { char: '✧', color: PALETTE.primary },
            { char: '★', color: PALETTE.chart2Teal },
            { char: '✦', color: PALETTE.chart4Magenta },
            { char: '✧', color: PALETTE.primaryLight },
            { char: '★', color: PALETTE.primary },
            { char: '✶', color: PALETTE.chart1Purple },
        ],
    },
};

// Star positions (consistent across cards)
export interface StarPosition {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    size: string;
    delay: number;
}

export const STAR_POSITIONS: StarPosition[] = [
    { top: '18%', left: '8%', size: '1.75rem', delay: 0 },
    { top: '25%', right: '12%', size: '1.25rem', delay: 0.5 },
    { bottom: '28%', left: '6%', size: '1.5rem', delay: 1 },
    { bottom: '18%', right: '10%', size: '1.75rem', delay: 1.5 },
    { top: '45%', left: '4%', size: '1rem', delay: 2 },
    { top: '55%', right: '5%', size: '1.25rem', delay: 2.5 },
];

// Framer Motion card animation variants
export const cardVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
        rotate: direction > 0 ? 5 : -5,
        scale: 0.8,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        rotate: 0,
        scale: 1,
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0,
        rotate: direction < 0 ? 5 : -5,
        scale: 0.8,
    }),
};

// Motion animation variants for card elements
export const cardMotionVariants = {
    fadeInUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
    },
    scaleIn: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
    },
    slideInLeft: {
        initial: { opacity: 0, x: -40 },
        animate: { opacity: 1, x: 0 },
    },
    slideInRight: {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
    },
} as const;

export const headlineMotionVariants = {
    small: {
        initial: { opacity: 0, y: 30, rotate: -3 },
        animate: { opacity: 1, y: 0, rotate: 0 },
    },
    big: {
        initial: { opacity: 0, scale: 0.5 },
        animate: { opacity: 1, scale: 1 },
    },
    medium: {
        initial: { opacity: 0, y: 30, rotate: 3 },
        animate: { opacity: 1, y: 0, rotate: 0 },
    },
    accent: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
    },
} as const;
