import { useState, useEffect, useRef } from 'react';

interface UseAnimatedNumberOptions {
    delay?: number;
    duration?: number;
    enabled?: boolean;
}

export function useAnimatedNumber(
    targetValue: number,
    options: UseAnimatedNumberOptions = {}
): number {
    const { delay = 0, duration = 1000, enabled = true } = options;
    const [displayValue, setDisplayValue] = useState(0);
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        if (!enabled) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: reset display when disabled
            setDisplayValue(0);
            return;
        }

        const timeoutId = setTimeout(() => {
            const animate = (timestamp: number) => {
                if (startTimeRef.current === null) {
                    startTimeRef.current = timestamp;
                }

                const elapsed = timestamp - startTimeRef.current;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic for smooth deceleration
                const eased = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.round(eased * targetValue);

                setDisplayValue(currentValue);

                if (progress < 1) {
                    animationRef.current = requestAnimationFrame(animate);
                }
            };

            animationRef.current = requestAnimationFrame(animate);
        }, delay);

        return () => {
            clearTimeout(timeoutId);
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
            }
            startTimeRef.current = null;
        };
    }, [targetValue, delay, duration, enabled]);

    return displayValue;
}
