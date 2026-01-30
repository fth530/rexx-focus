import { useCallback } from 'react';

/**
 * Zen Tech Sonic Branding Hook
 * 
 * Generates professional sound effects using Web Audio API
 * No external audio files required - pure browser-native synthesis
 */
export const useSoundEffects = () => {
    // Create audio context (lazy initialization to avoid Safari autoplay issues)
    const getAudioContext = useCallback(() => {
        if (typeof window === 'undefined') return null;
        return new (window.AudioContext || (window as any).webkitAudioContext)();
    }, []);

    /**
     * Start Sound: Futuristic power-up
     * Rising sine wave (240Hz → 480Hz) over 120ms
     */
    const playStart = useCallback(() => {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            // Sine wave for smooth, futuristic feel
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(240, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.12);

            // Smooth envelope (fade in/out)
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
            gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.12);

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.12);

            // Clean up
            setTimeout(() => {
                oscillator.disconnect();
                gainNode.disconnect();
                ctx.close();
            }, 150);
        } catch (error) {
            console.warn('Sound playback failed:', error);
        }
    }, [getAudioContext]);

    /**
     * Stop Sound: Mechanical click
     * Triangle wave at 200Hz for 80ms
     */
    const playStop = useCallback(() => {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            // Triangle wave for mechanical, precise feel
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(200, ctx.currentTime);

            // Quick, sharp envelope
            gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.08);

            // Clean up
            setTimeout(() => {
                oscillator.disconnect();
                gainNode.disconnect();
                ctx.close();
            }, 100);
        } catch (error) {
            console.warn('Sound playback failed:', error);
        }
    }, [getAudioContext]);

    /**
     * Finish Sound: Zen achievement gong
     * A Major chord (A4-C#5-E5: 440Hz, 554Hz, 659Hz) with reverb
     */
    const playFinish = useCallback(() => {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const duration = 0.8;
            const frequencies = [440, 554.37, 659.25]; // A Major chord

            // Create reverb with ConvolverNode simulation
            const convolver = ctx.createConvolver();
            const impulseLength = ctx.sampleRate * 1;
            const impulse = ctx.createBuffer(2, impulseLength, ctx.sampleRate);

            // Generate simple reverb impulse
            for (let channel = 0; channel < 2; channel++) {
                const channelData = impulse.getChannelData(channel);
                for (let i = 0; i < impulseLength; i++) {
                    channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLength, 2);
                }
            }
            convolver.buffer = impulse;

            const masterGain = ctx.createGain();
            masterGain.gain.setValueAtTime(0.2, ctx.currentTime);
            masterGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

            // Create each note in the chord
            frequencies.forEach((freq, index) => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

                // Stagger the notes slightly for richer sound
                const startDelay = index * 0.02;
                gainNode.gain.setValueAtTime(0, ctx.currentTime + startDelay);
                gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + startDelay + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

                oscillator.connect(gainNode);
                gainNode.connect(convolver);
                gainNode.connect(masterGain); // Also dry signal

                oscillator.start(ctx.currentTime + startDelay);
                oscillator.stop(ctx.currentTime + duration);
            });

            convolver.connect(masterGain);
            masterGain.connect(ctx.destination);

            // Clean up
            setTimeout(() => {
                convolver.disconnect();
                masterGain.disconnect();
                ctx.close();
            }, (duration + 0.5) * 1000);
        } catch (error) {
            console.warn('Sound playback failed:', error);
        }
    }, [getAudioContext]);

    return {
        playStart,
        playStop,
        playFinish,
    };
};
