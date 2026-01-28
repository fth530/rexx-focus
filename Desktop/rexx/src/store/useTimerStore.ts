import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSettingsStore } from './useSettingsStore';

export type TimerMode = 'work' | 'shortBreak' | 'longBreak' | 'custom';

interface TimerState {
    mode: TimerMode;
    timeLeft: number;
    isRunning: boolean;
    customDuration: number; // in seconds
    sessionCount: number; // Total completed sessions
    lastTick: number | null; // Timestamp for recovery
    setMode: (mode: TimerMode) => void;
    setCustomDuration: (minutes: number) => void;
    tick: () => void;
    start: () => void;
    pause: () => void;
    reset: () => void;
    completeSession: () => void;
}

// Get duration based on mode and settings
export const getDuration = (mode: Exclude<TimerMode, 'custom'>): number => {
    const { customDurations } = useSettingsStore.getState();
    const durations = {
        work: customDurations.work * 60,
        shortBreak: customDurations.shortBreak * 60,
        longBreak: customDurations.longBreak * 60,
    };
    return durations[mode];
};

export const useTimerStore = create<TimerState>()(
    persist(
        (set) => ({
            mode: 'work',
            timeLeft: getDuration('work'),
            isRunning: false,
            customDuration: 45 * 60,
            sessionCount: 0,
            lastTick: null,

            setMode: (mode) => set((state) => {
                const duration = mode === 'custom'
                    ? state.customDuration
                    : getDuration(mode);

                return {
                    mode,
                    timeLeft: duration,
                    isRunning: false,
                    lastTick: null,
                };
            }),

            setCustomDuration: (minutes) => set(() => {
                const duration = minutes * 60;
                return {
                    mode: 'custom',
                    customDuration: duration,
                    timeLeft: duration,
                    isRunning: false,
                    lastTick: null,
                };
            }),

            tick: () => set((state) => {
                if (state.timeLeft <= 0) {
                    return {
                        isRunning: false,
                        timeLeft: 0,
                        lastTick: null,
                    };
                }
                return {
                    timeLeft: state.timeLeft - 1,
                    lastTick: Date.now(),
                };
            }),

            start: () => set({
                isRunning: true,
                lastTick: Date.now(),
            }),

            pause: () => set({
                isRunning: false,
                lastTick: null,
            }),

            reset: () => set((state) => {
                const duration = state.mode === 'custom'
                    ? state.customDuration
                    : getDuration(state.mode);

                return {
                    timeLeft: duration,
                    isRunning: false,
                    lastTick: null,
                };
            }),

            completeSession: () => set((state) => ({
                sessionCount: state.sessionCount + 1,
            })),
        }),
        {
            name: 'rexx-timer-state',
            partialize: (state) => ({
                mode: state.mode,
                timeLeft: state.timeLeft,
                isRunning: state.isRunning,
                customDuration: state.customDuration,
                sessionCount: state.sessionCount,
                lastTick: state.lastTick,
            }),
        }
    )
);

// Recovery function - called on app mount
export const recoverTimerState = () => {
    const state = useTimerStore.getState();

    if (state.isRunning && state.lastTick) {
        const now = Date.now();
        const elapsed = Math.floor((now - state.lastTick) / 1000);
        const newTimeLeft = Math.max(0, state.timeLeft - elapsed);

        useTimerStore.setState({
            timeLeft: newTimeLeft,
            isRunning: newTimeLeft > 0,
            lastTick: newTimeLeft > 0 ? now : null,
        });
    }
};
