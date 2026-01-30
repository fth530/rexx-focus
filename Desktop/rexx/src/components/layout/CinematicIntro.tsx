import { motion } from 'framer-motion';

interface CinematicIntroProps {
    onEnter: () => void;
}

export const CinematicIntro = ({ onEnter }: CinematicIntroProps) => {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black"
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
            }}
            onClick={onEnter}
        >
            {/* The Breathing Core - Central Icon */}
            <div className="relative flex flex-col items-center gap-8">
                {/* Icon Circle with Breathing Animation */}
                <motion.div
                    className="relative flex items-center justify-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                    }}
                    transition={{
                        duration: 1.5,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.3,
                    }}
                >
                    {/* Outer Glow Ring (Theme-aware) */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-accent/20 blur-2xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        style={{
                            width: '120px',
                            height: '120px',
                            marginLeft: '-10px',
                            marginTop: '-10px',
                        }}
                    />

                    {/* Main Icon Circle */}
                    <motion.div
                        className="relative w-24 h-24 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 flex items-center justify-center backdrop-blur-sm"
                        animate={{
                            scale: [0.95, 1, 0.95],
                            opacity: [0.9, 1, 0.9],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        {/* Inner Circle (Breathing Core) */}
                        <motion.div
                            className="w-12 h-12 rounded-full bg-accent/40 blur-sm"
                            animate={{
                                scale: [0.9, 1.1, 0.9],
                                opacity: [0.6, 0.9, 0.6],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />

                        {/* Center Dot */}
                        <div className="absolute w-3 h-3 rounded-full bg-accent" />
                    </motion.div>
                </motion.div>

                {/* Micro Typography */}
                <motion.div
                    className="flex flex-col items-center gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 1,
                        delay: 1.2,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                >
                    {/* Brand Name */}
                    <h1 className="text-xs tracking-[0.3em] text-white/70 font-medium uppercase">
                        REXX FOCUS
                    </h1>

                    {/* Tagline */}
                    <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase">
                        Master Your Flow
                    </p>
                </motion.div>

                {/* Subtle Hint */}
                <motion.div
                    className="absolute bottom-[-80px] text-[10px] tracking-[0.25em] text-white/20 uppercase"
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0, 0.4, 0],
                    }}
                    transition={{
                        duration: 3,
                        delay: 2,
                        repeat: Infinity,
                        repeatDelay: 2,
                    }}
                >
                    Tap to begin
                </motion.div>
            </div>

            {/* Film Grain Overlay (Ultra Subtle) */}
            <div
                className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage:
                        'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                }}
            />

            {/* Vignette Effect */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(circle at center, transparent 0%, transparent 60%, rgba(0,0,0,0.3) 100%)',
                }}
            />
        </motion.div>
    );
};
