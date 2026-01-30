import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error Boundary caught:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] text-white px-4">
                    <motion.div
                        className="text-center max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Error Icon */}
                        <motion.div
                            className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-full bg-accent/10 border border-accent/20"
                            animate={{
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <AlertTriangle className="w-10 h-10 text-accent" />
                        </motion.div>

                        {/* Error Message */}
                        <h1 className="text-3xl font-bold mb-4">
                            Bir Şeyler Ters Gitti
                        </h1>
                        <p className="text-text-dim mb-8 leading-relaxed">
                            Uygulama beklenmedik bir hatayla karşılaştı.
                            Sayfayı yenileyerek tekrar deneyebilirsiniz.
                        </p>

                        {/* Error Details (Development) */}
                        {import.meta.env.DEV && this.state.error && (
                            <div className="mb-8 p-4 bg-surface/50 rounded-xl border border-white/5 text-left">
                                <p className="text-xs font-mono text-red-400 break-all">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}

                        {/* Reset Button */}
                        <motion.button
                            onClick={this.handleReset}
                            className="inline-flex items-center gap-3 px-6 py-3 bg-accent hover:opacity-90 rounded-xl font-semibold shadow-lg shadow-accent/20 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <RotateCcw size={20} />
                            Sayfayı Yenile
                        </motion.button>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}
