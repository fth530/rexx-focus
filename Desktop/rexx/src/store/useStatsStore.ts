import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DailyStats {
    date: string; // 'YYYY-MM-DD'
    focusMinutes: number;
    tasksCompleted: number;
    sessions: number;
}

interface StatsState {
    history: DailyStats[];
    addFocusTime: (minutes: number) => void;
    incrementTask: () => void;
    incrementSession: () => void;
    getTodayStats: () => DailyStats;
    getLast7Days: () => DailyStats[];
    getComparisonPercent: () => number;
    resetStats: () => void;
}

const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

const getDateDaysAgo = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
};

export const useStatsStore = create<StatsState>()(
    persist(
        (set, get) => ({
            history: [],

            addFocusTime: (minutes) => set((state) => {
                const today = getTodayDate();
                const existingIndex = state.history.findIndex(h => h.date === today);

                if (existingIndex >= 0) {
                    const updated = [...state.history];
                    updated[existingIndex] = {
                        ...updated[existingIndex],
                        focusMinutes: updated[existingIndex].focusMinutes + minutes,
                    };
                    return { history: updated };
                } else {
                    return {
                        history: [...state.history, {
                            date: today,
                            focusMinutes: minutes,
                            tasksCompleted: 0,
                            sessions: 0,
                        }],
                    };
                }
            }),

            incrementTask: () => set((state) => {
                const today = getTodayDate();
                const existingIndex = state.history.findIndex(h => h.date === today);

                if (existingIndex >= 0) {
                    const updated = [...state.history];
                    updated[existingIndex] = {
                        ...updated[existingIndex],
                        tasksCompleted: updated[existingIndex].tasksCompleted + 1,
                    };
                    return { history: updated };
                } else {
                    return {
                        history: [...state.history, {
                            date: today,
                            focusMinutes: 0,
                            tasksCompleted: 1,
                            sessions: 0,
                        }],
                    };
                }
            }),

            incrementSession: () => set((state) => {
                const today = getTodayDate();
                const existingIndex = state.history.findIndex(h => h.date === today);

                if (existingIndex >= 0) {
                    const updated = [...state.history];
                    updated[existingIndex] = {
                        ...updated[existingIndex],
                        sessions: updated[existingIndex].sessions + 1,
                    };
                    return { history: updated };
                } else {
                    return {
                        history: [...state.history, {
                            date: today,
                            focusMinutes: 0,
                            tasksCompleted: 0,
                            sessions: 1,
                        }],
                    };
                }
            }),

            getTodayStats: () => {
                const today = getTodayDate();
                const todayData = get().history.find(h => h.date === today);
                return todayData || {
                    date: today,
                    focusMinutes: 0,
                    tasksCompleted: 0,
                    sessions: 0,
                };
            },

            getLast7Days: () => {
                const last7Days: DailyStats[] = [];
                const { history } = get();

                for (let i = 6; i >= 0; i--) {
                    const date = getDateDaysAgo(i);
                    const dayData = history.find(h => h.date === date);
                    last7Days.push(dayData || {
                        date,
                        focusMinutes: 0,
                        tasksCompleted: 0,
                        sessions: 0,
                    });
                }

                return last7Days;
            },

            getComparisonPercent: () => {
                const today = getTodayDate();
                const yesterday = getDateDaysAgo(1);
                const { history } = get();

                const todayData = history.find(h => h.date === today);
                const yesterdayData = history.find(h => h.date === yesterday);

                const todayMinutes = todayData?.focusMinutes || 0;
                const yesterdayMinutes = yesterdayData?.focusMinutes || 0;

                if (yesterdayMinutes === 0) return todayMinutes > 0 ? 100 : 0;

                return Math.round(((todayMinutes - yesterdayMinutes) / yesterdayMinutes) * 100);
            },

            resetStats: () => set({ history: [] }),
        }),
        {
            name: 'rexx-stats',
        }
    )
);
