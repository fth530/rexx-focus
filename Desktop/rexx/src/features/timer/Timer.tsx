import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Brain, Moon, Plus } from 'lucide-react';
import { useTimerStore, recoverTimerState } from '../../store/useTimerStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useStatsStore } from '../../store/useStatsStore';
import { useInterval } from '../../hooks/useInterval';
import { Button } from '../../components/ui';
import { playNotificationSound } from '../../hooks/useNotification';
import { useSoundEffects } from '../../hooks/useSoundEffects';

interface TimerProps {
    onFocusChange?: (isFocused: boolean) => void;
}

export const Timer = ({ onFocusChange }: TimerProps) => {
    const {
        mode,
        timeLeft,
        isRunning,
        customDuration,
        sessionCount,
        setMode,
        setCustomDuration,
        tick,
        start,
        pause,
        reset,
        completeSession,
    } = useTimerStore();

    const { soundEnabled, customDurations } = useSettingsStore();
    const { addFocusTime, incrementSession } = useStatsStore();
    const { playStart, playStop, playFinish } = useSoundEffects();

    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customMinutes, setCustomMinutes] = useState('45');
    const inputRef = useRef<HTMLInputElement>(null);

    // Recover timer state on mount
    React.useEffect(() => {
        recoverTimerState();
    }, []);

    useInterval(() => {
        if (isRunning) {
            tick();
        }
    }, isRunning ? 1000 : null);

    React.useEffect(() => {
        onFocusChange?.(isRunning);
    }, [isRunning, onFocusChange]);

    React.useEffect(() => {
        if (timeLeft === 0 && !isRunning) {
            completeSession();

            // Track stats only for work sessions
            if (mode === 'work') {
                addFocusTime(customDurations.work);
                incrementSession();
            }

            if (soundEnabled) {
                playNotificationSound();
                playFinish(); // Zen achievement gong
            }
            if (Notification.permission === 'granted') {
                new Notification('Rexx Focus', {
                    body: mode === 'work' ? 'Çalışma süresi bitti! Ara verme vakti.' : 'Ara bitti! Odaklanma vakti.',
                    icon: '/vite.svg'
                });
            }
        }
    }, [timeLeft, isRunning, mode, completeSession, soundEnabled, customDurations, addFocusTime, incrementSession, playFinish]);

    React.useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    React.useEffect(() => {
        if (showCustomInput && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showCustomInput]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCustomSubmit = () => {
        const minutes = parseInt(customMinutes);
        if (minutes > 0 && minutes <= 240) {
            setCustomDuration(minutes);
            setShowCustomInput(false);
        }
    };

    const handleCustomBlur = () => {
        setTimeout(() => setShowCustomInput(false), 150);
    };

    const totalTime = mode === 'custom'
        ? customDuration
        : mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;

    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <motion.div
            className="flex flex-col items-center gap-12"
            animate={{
                scale: isRunning ? 1.05 : 1,
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            {/* Mode Switches */}
            <div className="flex gap-2 p-1 bg-surface rounded-2xl border border-white/5" role="group" aria-label="Zamanlayıcı modları">
                <ModeButton
                    active={mode === 'work'}
                    onClick={() => setMode('work')}
                    icon={<Brain size={16} />}
                    label="Work"
                    ariaLabel="Çalışma moduna geç"
                />
                <ModeButton
                    active={mode === 'shortBreak'}
                    onClick={() => setMode('shortBreak')}
                    icon={<Coffee size={16} />}
                    label="Short"
                    ariaLabel="Kısa mola moduna geç"
                />
                <ModeButton
                    active={mode === 'longBreak'}
                    onClick={() => setMode('longBreak')}
                    icon={<Moon size={16} />}
                    label="Long"
                    ariaLabel="Uzun mola moduna geç"
                />

                {/* Custom Duration Button/Input */}
                <AnimatePresence mode="wait">
                    {showCustomInput ? (
                        <motion.div
                            key="custom-input"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-1"
                        >
                            <input
                                ref={inputRef}
                                type="number"
                                min="1"
                                max="240"
                                value={customMinutes}
                                onChange={(e) => setCustomMinutes(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCustomSubmit();
                                    if (e.key === 'Escape') setShowCustomInput(false);
                                }}
                                onBlur={handleCustomBlur}
                                placeholder="Min"
                                aria-label="Özel süre (dakika)"
                                className="w-16 px-2 py-2 bg-surface border border-accent/50 rounded-xl text-sm text-white text-center focus:outline-none focus:border-accent shadow-lg shadow-accent/20"
                            />
                            <motion.button
                                onClick={handleCustomSubmit}
                                className="px-2 py-2 text-xs text-accent hover:text-white transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Özel süreyi onayla"
                            >
                                ✓
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.button
                            key="custom-button"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setShowCustomInput(true)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${mode === 'custom'
                                ? 'bg-accent text-white shadow-lg shadow-accent/20'
                                : 'text-text-dim hover:bg-white/5 border border-white/10'
                                }`}
                            aria-label={mode === 'custom' ? `Özel mod: ${Math.floor(customDuration / 60)} dakika` : 'Özel süre ekle'}
                        >
                            {mode === 'custom' ? (
                                <span className="text-sm font-medium">{Math.floor(customDuration / 60)}m</span>
                            ) : (
                                <Plus size={16} />
                            )}
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Timer Visual */}
            <motion.div
                className="relative flex items-center justify-center"
                animate={{
                    filter: isRunning
                        ? 'drop-shadow(0 0 40px var(--color-accent))'
                        : 'drop-shadow(0 0 0px var(--color-accent))',
                }}
                transition={{ duration: 0.5 }}
                role="timer"
                aria-live="polite"
                aria-atomic="true"
                aria-label={`${formatTime(timeLeft)} kaldı`}
            >
                <svg className="w-72 h-72 transform -rotate-90" aria-hidden="true">
                    <circle
                        cx="144"
                        cy="144"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-white/5"
                    />
                    <motion.circle
                        cx="144"
                        cy="144"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="text-accent transition-all duration-1000 ease-linear"
                        animate={{
                            strokeWidth: isRunning ? 14 : 12,
                        }}
                        transition={{ duration: 0.3 }}
                    />
                </svg>

                <div className="absolute flex flex-col items-center">
                    <motion.span
                        className="text-6xl font-bold tracking-tighter text-text-main"
                        animate={{
                            scale: isRunning && timeLeft % 2 === 0 ? 1.02 : 1,
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        {formatTime(timeLeft)}
                    </motion.span>
                    <span className="text-sm font-medium uppercase tracking-[0.2em] text-text-dim mt-2">
                        {mode === 'work' ? 'Focus Session' : mode === 'custom' ? 'Custom Session' : 'Time to Rest'}
                    </span>
                    {sessionCount > 0 && (
                        <span className="text-xs text-text-dim/50 mt-2">
                            {sessionCount} session{sessionCount > 1 ? 's' : ''} tamamlandı
                        </span>
                    )}
                </div>
            </motion.div>

            {/* Controls */}
            <div className="flex items-center gap-6" role="group" aria-label="Zamanlayıcı kontrolleri">
                <motion.button
                    onClick={reset}
                    className="p-4 text-text-dim hover:text-text-main transition-colors"
                    whileHover={{ scale: 1.1, rotate: -15 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Zamanlayıcıyı sıfırla"
                    title="Sıfırla"
                >
                    <RotateCcw size={24} />
                </motion.button>

                <Button
                    onClick={() => {
                        if (isRunning) {
                            pause();
                            if (soundEnabled) playStop();
                        } else {
                            start();
                            if (soundEnabled) playStart();
                        }
                    }}
                    className="w-20 h-20 rounded-full"
                    size="lg"
                    aria-label={isRunning ? 'Zamanlayıcıyı duraklat' : 'Zamanlayıcıyı başlat'}
                >
                    {isRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </Button>

                <div className="w-12 h-12" aria-hidden="true" />
            </div>
        </motion.div>
    );
};

const ModeButton = ({
    active,
    onClick,
    icon,
    label,
    ariaLabel,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    ariaLabel: string;
}) => (
    <motion.button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${active
            ? 'bg-accent text-white shadow-lg shadow-accent/20'
            : 'text-text-dim hover:bg-white/5'
            }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={ariaLabel}
        aria-pressed={active}
        role="button"
    >
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </motion.button>
);
