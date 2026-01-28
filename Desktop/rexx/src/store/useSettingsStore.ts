import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CustomDurations {
    work: number;
    shortBreak: number;
    longBreak: number;
}

interface SettingsState {
    customDurations: CustomDurations;
    soundEnabled: boolean;
    setSoundEnabled: (enabled: boolean) => void;
    updateDurations: (durations: Partial<CustomDurations>) => void;
    resetToDefaults: () => void;
    applyPreset: (preset: 'classic' | 'deepWork' | 'sprint') => void;
}

const DEFAULT_DURATIONS: CustomDurations = {
    work: 25,
    shortBreak: 5,
    longBreak: 15,
};

const PRESETS: Record<string, CustomDurations> = {
    classic: { work: 25, shortBreak: 5, longBreak: 15 },
    deepWork: { work: 90, shortBreak: 15, longBreak: 30 },
    sprint: { work: 15, shortBreak: 3, longBreak: 10 },
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            customDurations: DEFAULT_DURATIONS,
            soundEnabled: true,

            setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

            updateDurations: (durations) => set((state) => ({
                customDurations: {
                    ...state.customDurations,
                    ...durations,
                },
            })),

            resetToDefaults: () => set({
                customDurations: DEFAULT_DURATIONS,
                soundEnabled: true,
            }),

            applyPreset: (preset) => set({
                customDurations: PRESETS[preset],
            }),
        }),
        {
            name: 'rexx-settings',
        }
    )
);
