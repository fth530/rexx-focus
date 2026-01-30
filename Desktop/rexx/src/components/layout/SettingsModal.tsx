import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings as SettingsIcon, Minus, Plus, Volume2, VolumeX } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Button } from '../ui';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
    const {
        customDurations,
        soundEnabled,
        currentTheme,
        setSoundEnabled,
        setTheme,
        updateDurations,
        resetToDefaults,
        applyPreset,
    } = useSettingsStore();

    const [localDurations, setLocalDurations] = useState(customDurations);

    const handleSave = () => {
        updateDurations(localDurations);
        onClose();
    };

    const handlePreset = (preset: 'classic' | 'deepWork' | 'sprint') => {
        applyPreset(preset);
        onClose();
    };

    const adjustDuration = (type: keyof typeof localDurations, delta: number) => {
        setLocalDurations((prev) => ({
            ...prev,
            [type]: Math.max(1, Math.min(240, prev[type] + delta)),
        }));
    };

    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            return () => window.removeEventListener('keydown', handleEsc);
        }
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            className="w-full max-w-md bg-surface border border-white/10 rounded-2xl shadow-2xl"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            role="dialog"
                            aria-labelledby="settings-title"
                            aria-modal="true"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <SettingsIcon className="w-6 h-6 text-accent" />
                                    <h2 id="settings-title" className="text-xl font-bold text-white">
                                        Ayarlar
                                    </h2>
                                </div>
                                <motion.button
                                    onClick={onClose}
                                    className="p-2 text-text-dim hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="Ayarları kapat"
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-8">
                                {/* Timer Durations */}
                                <section>
                                    <h3 className="text-sm font-semibold text-text-main uppercase tracking-wider mb-4">
                                        🎛️ Zamanlayıcı Süreleri
                                    </h3>
                                    <div className="space-y-3">
                                        <DurationSpinner
                                            label="Çalışma"
                                            value={localDurations.work}
                                            onIncrement={() => adjustDuration('work', 5)}
                                            onDecrement={() => adjustDuration('work', -5)}
                                        />
                                        <DurationSpinner
                                            label="Kısa Ara"
                                            value={localDurations.shortBreak}
                                            onIncrement={() => adjustDuration('shortBreak', 1)}
                                            onDecrement={() => adjustDuration('shortBreak', -1)}
                                        />
                                        <DurationSpinner
                                            label="Uzun Ara"
                                            value={localDurations.longBreak}
                                            onIncrement={() => adjustDuration('longBreak', 5)}
                                            onDecrement={() => adjustDuration('longBreak', -5)}
                                        />
                                    </div>
                                </section>

                                {/* Sound Toggle */}
                                <section>
                                    <h3 className="text-sm font-semibold text-text-main uppercase tracking-wider mb-4">
                                        🔔 Bildirimler
                                    </h3>
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            {soundEnabled ? <Volume2 size={20} className="text-accent" /> : <VolumeX size={20} className="text-text-dim" />}
                                            <span className="text-sm font-medium text-text-main">
                                                Ses Efektleri
                                            </span>
                                        </div>
                                        <ToggleSwitch
                                            checked={soundEnabled}
                                            onChange={setSoundEnabled}
                                        />
                                    </div>
                                </section>

                                {/* Theme Switcher */}
                                <section>
                                    <h3 className="text-sm font-semibold text-text-main uppercase tracking-wider mb-4">
                                        🎨 Tema / Görünüm
                                    </h3>
                                    <div className="flex items-center justify-center gap-4" role="radiogroup" aria-label="Tema seçimi">
                                        <ColorSwatch
                                            color="#FF5722"
                                            label="Sunset"
                                            isActive={currentTheme === 'sunset'}
                                            onClick={() => setTheme('sunset')}
                                        />
                                        <ColorSwatch
                                            color="#06b6d4"
                                            label="Ocean"
                                            isActive={currentTheme === 'ocean'}
                                            onClick={() => setTheme('ocean')}
                                        />
                                        <ColorSwatch
                                            color="#10b981"
                                            label="Forest"
                                            isActive={currentTheme === 'forest'}
                                            onClick={() => setTheme('forest')}
                                        />
                                        <ColorSwatch
                                            color="#8b5cf6"
                                            label="Nebula"
                                            isActive={currentTheme === 'nebula'}
                                            onClick={() => setTheme('nebula')}
                                        />
                                        <ColorSwatch
                                            color="#ef4444"
                                            label="Classic"
                                            isActive={currentTheme === 'classic'}
                                            onClick={() => setTheme('classic')}
                                        />
                                    </div>
                                </section>

                                {/* Presets */}
                                <section>
                                    <h3 className="text-sm font-semibold text-text-main uppercase tracking-wider mb-4">
                                        📦 Hazır Şablonlar
                                    </h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        <PresetButton
                                            label="Classic"
                                            subtitle="25/5/15"
                                            onClick={() => handlePreset('classic')}
                                        />
                                        <PresetButton
                                            label="Deep Work"
                                            subtitle="90/15/30"
                                            onClick={() => handlePreset('deepWork')}
                                        />
                                        <PresetButton
                                            label="Sprint"
                                            subtitle="15/3/10"
                                            onClick={() => handlePreset('sprint')}
                                        />
                                    </div>
                                </section>
                            </div>

                            {/* Footer */}
                            <div className="flex gap-3 p-6 border-t border-white/5">
                                <Button
                                    variant="ghost"
                                    onClick={resetToDefaults}
                                    className="flex-1"
                                    aria-label="Varsayılan ayarlara dön"
                                >
                                    Sıfırla
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleSave}
                                    className="flex-1"
                                    aria-label="Ayarları kaydet"
                                >
                                    Kaydet
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

// Duration Spinner Component
const DurationSpinner = ({
    label,
    value,
    onIncrement,
    onDecrement,
    min = 1,
    max = 240,
}: {
    label: string;
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    min?: number;
    max?: number;
}) => {
    const isAtMin = value <= min;
    const isAtMax = value >= max;

    return (
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-sm font-medium text-text-main">{label}</span>
            <div className="flex items-center gap-2">
                <motion.button
                    onClick={onDecrement}
                    disabled={isAtMin}
                    className={`p-2 rounded-lg transition-colors ${isAtMin
                        ? 'bg-white/5 text-text-dim cursor-not-allowed opacity-50'
                        : 'bg-accent/10 hover:bg-accent/20 text-accent'
                        }`}
                    whileHover={isAtMin ? {} : { scale: 1.1 }}
                    whileTap={isAtMin ? {} : { scale: 0.9 }}
                    aria-label={`${label} süresini azalt`}
                    aria-disabled={isAtMin}
                >
                    <Minus size={16} />
                </motion.button>
                <span className="w-12 text-center text-lg font-bold text-white">
                    {value}
                </span>
                <motion.button
                    onClick={onIncrement}
                    disabled={isAtMax}
                    className={`p-2 rounded-lg transition-colors ${isAtMax
                        ? 'bg-white/5 text-text-dim cursor-not-allowed opacity-50'
                        : 'bg-accent/10 hover:bg-accent/20 text-accent'
                        }`}
                    whileHover={isAtMax ? {} : { scale: 1.1 }}
                    whileTap={isAtMax ? {} : { scale: 0.9 }}
                    aria-label={`${label} süresini artır`}
                    aria-disabled={isAtMax}
                >
                    <Plus size={16} />
                </motion.button>
                <span className="text-xs text-text-dim ml-1">dk</span>
            </div>
        </div>
    );
};

// Toggle Switch Component
const ToggleSwitch = ({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
}) => (
    <motion.button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-white/10'
            }`}
        whileTap={{ scale: 0.95 }}
        role="switch"
        aria-checked={checked}
        aria-label="Ses efektlerini aç/kapat"
    >
        <motion.div
            className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
            animate={{
                x: checked ? 24 : 0,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
    </motion.button>
);

// Preset Button Component
const PresetButton = ({
    label,
    subtitle,
    onClick,
}: {
    label: string;
    subtitle: string;
    onClick: () => void;
}) => (
    <motion.button
        onClick={onClick}
        className="flex flex-col items-center gap-1 p-3 bg-transparent border border-accent/30 hover:bg-accent/5 rounded-xl transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`${label} şablonunu uygula: ${subtitle}`}
    >
        <span className="text-sm font-semibold text-white">{label}</span>
        <span className="text-xs text-text-dim">{subtitle}</span>
    </motion.button>
);

// Color Swatch Component (Glowing Theme Selector)
const ColorSwatch = ({
    color,
    label,
    isActive,
    onClick,
}: {
    color: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
}) => {
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <motion.button
                onClick={onClick}
                onKeyDown={handleKeyPress}
                className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                role="radio"
                aria-checked={isActive}
                aria-label={`${label} teması`}
                tabIndex={0}
            >
                {/* Outer Glow (Active only) */}
                {isActive && (
                    <motion.div
                        className="absolute inset-0 rounded-full blur-xl opacity-60"
                        style={{ backgroundColor: color }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.6, 0.8, 0.6],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                )}

                {/* Double Ring (Active only) */}
                {isActive && (
                    <>
                        {/* Outer Ring */}
                        <motion.div
                            className="absolute -inset-2 rounded-full border-2"
                            style={{ borderColor: color }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                        {/* Inner Ring */}
                        <motion.div
                            className="absolute -inset-1 rounded-full border"
                            style={{ borderColor: color, opacity: 0.5 }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 0.5, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.05 }}
                        />
                    </>
                )}

                {/* Color Circle */}
                <motion.div
                    className="relative w-12 h-12 rounded-full shadow-lg"
                    style={{ backgroundColor: color }}
                    animate={{
                        filter: isActive ? 'brightness(1.2)' : 'brightness(0.7) blur(1px)',
                    }}
                    transition={{ duration: 0.3 }}
                />
            </motion.button>

            {/* Label */}
            <span
                className="text-xs font-medium transition-colors"
                style={{ color: isActive ? color : '#A0A0A0' }}
            >
                {label}
            </span>
        </div>
    );
};
