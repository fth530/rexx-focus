import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, Zap, CheckCircle2, Flame, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useStatsStore } from '../../store/useStatsStore';
import { Button } from '../ui';

interface StatsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const StatsModal = ({ isOpen, onClose }: StatsModalProps) => {
    const {
        getTodayStats,
        getLast7Days,
        getComparisonPercent,
        resetStats,
    } = useStatsStore();

    const todayStats = getTodayStats();
    const last7Days = getLast7Days();
    const comparisonPercent = getComparisonPercent();

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

    const handleReset = () => {
        if (confirm('Tüm istatistikler silinecek. Emin misiniz?')) {
            resetStats();
        }
    };

    const getMotivation = () => {
        if (comparisonPercent > 20) return `🔥 İnanılmaz! Dünden %${comparisonPercent} fazla!`;
        if (comparisonPercent > 0) return `👏 Güzel ilerleme! %${comparisonPercent} artış!`;
        if (comparisonPercent === 0) return '💪 Aynı tempoyu koru!';
        return '📚 Bugün daha fazla odaklanabilirsin!';
    };

    // Chart data with day labels
    const chartData = last7Days.map((day) => {
        const date = new Date(day.date);
        const dayLabels = ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'];
        return {
            ...day,
            dayLabel: dayLabels[date.getDay()],
        };
    });

    const hasData = last7Days.some(d => d.focusMinutes > 0);

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
                            className="w-full max-w-2xl bg-surface border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            role="dialog"
                            aria-labelledby="stats-title"
                            aria-modal="true"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-surface z-10">
                                <div className="flex items-center gap-3">
                                    <BarChart3 className="w-6 h-6 text-accent" />
                                    <h2 id="stats-title" className="text-xl font-bold text-white">
                                        İstatistikler
                                    </h2>
                                </div>
                                <motion.button
                                    onClick={onClose}
                                    className="p-2 text-text-dim hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="İstatistikleri kapat"
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-8">
                                {/* KPI Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <KPICard
                                        icon={<Zap className="w-6 h-6" />}
                                        value={todayStats.focusMinutes}
                                        unit="dakika"
                                        label="Bugünkü Odak"
                                        trend={comparisonPercent !== 0 ? {
                                            direction: comparisonPercent > 0 ? 'up' : 'down',
                                            percent: Math.abs(comparisonPercent),
                                        } : undefined}
                                        pulse={todayStats.focusMinutes > 0}
                                    />
                                    <KPICard
                                        icon={<CheckCircle2 className="w-6 h-6" />}
                                        value={todayStats.tasksCompleted}
                                        label="Tamamlanan"
                                        subtext="Görev"
                                    />
                                    <KPICard
                                        icon={<Flame className="w-6 h-6" />}
                                        value={todayStats.sessions}
                                        label="Toplam Oturum"
                                        subtext="Bugün"
                                    />
                                </div>

                                {/* Chart */}
                                <section>
                                    <h3 className="text-sm font-semibold text-text-main uppercase tracking-wider mb-4">
                                        📈 Son 7 Gün
                                    </h3>
                                    <div className="bg-white/5 rounded-xl border border-white/5 p-4">
                                        {hasData ? (
                                            <ResponsiveContainer width="100%" height={200}>
                                                <BarChart data={chartData}>
                                                    <defs>
                                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#FF5722" stopOpacity={1} />
                                                            <stop offset="100%" stopColor="#F4511E" stopOpacity={0.8} />
                                                        </linearGradient>
                                                    </defs>
                                                    <XAxis
                                                        dataKey="dayLabel"
                                                        stroke="#666"
                                                        tick={{ fill: '#999', fontSize: 12 }}
                                                    />
                                                    <YAxis
                                                        stroke="#666"
                                                        tick={{ fill: '#999', fontSize: 12 }}
                                                        label={{ value: 'Dakika', angle: -90, position: 'insideLeft', fill: '#999' }}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: '#1A1A1A',
                                                            border: '1px solid rgba(255,255,255,0.1)',
                                                            borderRadius: '8px',
                                                            color: '#fff',
                                                        }}
                                                        labelStyle={{ color: '#FF5722' }}
                                                    />
                                                    <Bar
                                                        dataKey="focusMinutes"
                                                        fill="url(#barGradient)"
                                                        radius={[8, 8, 0, 0]}
                                                        animationDuration={800}
                                                    >
                                                        {chartData.map((entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={entry.date === todayStats.date ? '#FF5722' : 'url(#barGradient)'}
                                                            />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-48 text-text-dim">
                                                <BarChart3 className="w-12 h-12 mb-4 opacity-20" />
                                                <p className="text-sm">Henüz veri yok! İlk odaklanma seansını başlat.</p>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Motivation */}
                                {hasData && (
                                    <motion.div
                                        className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-center"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <p className="text-accent font-semibold">
                                            {getMotivation()}
                                        </p>
                                    </motion.div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex justify-center p-6 border-t border-white/5">
                                <Button
                                    variant="ghost"
                                    onClick={handleReset}
                                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                    aria-label="İstatistikleri sıfırla"
                                >
                                    Verileri Sıfırla
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

// KPI Card Component
const KPICard = ({
    icon,
    value,
    unit,
    label,
    subtext,
    trend,
    pulse = false,
}: {
    icon: React.ReactNode;
    value: number;
    unit?: string;
    label: string;
    subtext?: string;
    trend?: { direction: 'up' | 'down'; percent: number };
    pulse?: boolean;
}) => (
    <motion.div
        className={`relative bg-white/5 border border-white/10 rounded-xl p-4 transition-all ${pulse ? 'animate-pulse-subtle' : ''
            }`}
        whileHover={{
            borderColor: 'rgba(255,87,34,0.5)',
            boxShadow: '0 0 20px rgba(255,87,34,0.3)',
        }}
        transition={{ duration: 0.2 }}
    >
        <div className="flex items-start justify-between mb-3">
            <div className="text-accent">{icon}</div>
            {trend && (
                <div className={`flex items-center gap-1 text-xs font-semibold ${trend.direction === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                    {trend.direction === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {trend.percent}%
                </div>
            )}
        </div>
        <div className="space-y-1">
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{value}</span>
                {unit && <span className="text-sm text-text-dim">{unit}</span>}
            </div>
            <p className="text-xs font-medium text-text-dim uppercase tracking-wider">{label}</p>
            {subtext && <p className="text-xs text-text-dim/70">{subtext}</p>}
        </div>
    </motion.div>
);
