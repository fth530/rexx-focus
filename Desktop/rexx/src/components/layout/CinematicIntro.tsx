import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CinematicIntroProps {
    onEnter: () => void;
}

export const CinematicIntro = ({ onEnter }: CinematicIntroProps) => {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black"
            initial={{ opacity: 1 }}
            exit={{
                y: '-100%',
                transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
            }}
        >
            {/* Animated Orb Background */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(255,87,34,0.3) 0%, rgba(255,87,34,0.1) 40%, transparent 70%)',
                        filter: 'blur(80px)',
                    }}
                    animate={{
                        x: ['-50%', '-45%', '-50%'],
                        y: ['-50%', '-55%', '-50%'],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(255,87,34,0.2) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                    }}
                    animate={{
                        x: ['0%', '20%', '0%'],
                        y: ['0%', '-10%', '0%'],
                        scale: [1, 0.9, 1],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.5,
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6">
                {/* Main Title */}
                <motion.h1
                    className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                    <span className="bg-gradient-to-br from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                        Master Your
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-accent via-orange-500 to-accent bg-clip-text text-transparent">
                        Flow
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className="text-text-dim text-lg md:text-xl max-w-2xl mb-16 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                >
                    Derin odaklanma deneyimi için tasarlanan,
                    <br className="hidden md:block" />
                    minimalist ve güçlü bir üretkenlik alanı.
                </motion.p>

                {/* CTA Button */}
                <motion.button
                    onClick={onEnter}
                    className={cn(
                        'group relative overflow-hidden',
                        'px-8 py-4 rounded-2xl',
                        'bg-gradient-to-r from-accent to-orange-600',
                        'text-white font-semibold text-lg',
                        'shadow-2xl shadow-accent/50',
                        'transition-all duration-300',
                        'hover:shadow-accent/80 hover:scale-105',
                        'active:scale-95'
                    )}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="relative z-10 flex items-center gap-3">
                        Enter the Zone
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </span>

                    {/* Button Glow Effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                    />
                </motion.button>

                {/* Bottom Hint */}
                <motion.div
                    className="absolute bottom-12 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, delay: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                    <div className="flex flex-col items-center gap-2 text-text-dim/50 text-sm">
                        <span>Scroll to explore</span>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            ↓
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Grain Texture Overlay */}
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                }}
            />
        </motion.div>
    );
};
