import { useState, useEffect, useCallback, useRef } from 'react';
import { CARD_TO_TRACK } from '../components/interactiveTheme';

export function useBackgroundMusic(currentCardId: string) {
    const audiosRef = useRef<HTMLAudioElement[]>([]);
    const currentTrackRef = useRef<number>(-1);
    const hasStartedRef = useRef(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const targetTrack = CARD_TO_TRACK[currentCardId] ?? 0;

    // Initialize audio elements
    useEffect(() => {
        audiosRef.current = [1, 2, 3].map((n) => {
            const audio = new Audio(`/audio/${n}.mp3`);
            audio.loop = true;
            audio.preload = 'auto';
            audio.volume = 0.5; // 50% volume by default
            return audio;
        });

        // Attempt autoplay (usually blocked by browsers)
        audiosRef.current[0]
            ?.play()
            .then(() => {
                hasStartedRef.current = true;
                currentTrackRef.current = 0;
                setIsPlaying(true);
            })
            .catch(() => {
                // Autoplay blocked - will start on user interaction
            });

        return () => {
            audiosRef.current.forEach((audio) => {
                audio.pause();
                audio.src = '';
            });
        };
    }, []);

    // Switch tracks when card section changes
    useEffect(() => {
        if (!hasStartedRef.current || currentTrackRef.current === targetTrack) {
            return;
        }

        // Fade out current track and fade in new track
        const currentAudio = audiosRef.current[currentTrackRef.current];
        const newAudio = audiosRef.current[targetTrack];

        if (currentAudio) {
            currentAudio.pause();
        }

        if (!isMuted && newAudio) {
            newAudio.currentTime = 0;
            newAudio.play().catch(() => { });
        }

        currentTrackRef.current = targetTrack;
    }, [targetTrack, isMuted]);

    // Manual start for when autoplay was blocked
    const startMusic = useCallback(() => {
        if (hasStartedRef.current) return;

        const audio = audiosRef.current[targetTrack];
        if (audio) {
            audio
                .play()
                .then(() => {
                    hasStartedRef.current = true;
                    currentTrackRef.current = targetTrack;
                    setIsPlaying(true);
                })
                .catch(() => { });
        }
    }, [targetTrack]);

    // Toggle mute/unmute
    const toggleMute = useCallback(() => {
        setIsMuted((prev) => {
            const newMuted = !prev;

            if (newMuted) {
                // Mute: pause current track
                audiosRef.current.forEach((audio) => {
                    audio.pause();
                });
            } else {
                // Unmute: resume current track
                const currentAudio = audiosRef.current[currentTrackRef.current];
                if (currentAudio && hasStartedRef.current) {
                    currentAudio.play().catch(() => { });
                }
            }

            return newMuted;
        });
    }, []);

    // Set volume (0 to 1)
    const setVolume = useCallback((volume: number) => {
        audiosRef.current.forEach((audio) => {
            audio.volume = Math.max(0, Math.min(1, volume));
        });
    }, []);

    return {
        startMusic,
        isMuted,
        isPlaying,
        toggleMute,
        setVolume,
    };
}
