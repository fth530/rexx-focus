import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Yükleniyor...' }: { message?: string }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            >
                <Loader2 className="w-12 h-12 text-accent" />
            </motion.div>
            <p className="text-sm font-medium text-text-dim">{message}</p>
        </motion.div>
    </div>
);
