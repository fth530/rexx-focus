import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CustomDurations {
    work: number;
    shortBreak: number;
    longBreak: number;
}

export type Theme = 'sunset' | 'ocean' | 'forest' | 'nebula' | 'classic';

interface SettingsState {
    customDurations: CustomDurations;
    soundEnabled: boolean;
    currentTheme: Theme;
    setSoundEnabled: (enabled: boolean) => void;
    setTheme: (theme: Theme) => void;
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
            currentTheme: 'sunset' as Theme,

            setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

            setTheme: (theme) => set({ currentTheme: theme }),

            updateDurations: (durations) => set((state) => ({
                customDurations: {
                    ...state.customDurations,
                    ...durations,
                },
            })),

            resetToDefaults: () => set({
                customDurations: DEFAULT_DURATIONS,
                soundEnabled: true,
                currentTheme: 'sunset' as Theme,
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
