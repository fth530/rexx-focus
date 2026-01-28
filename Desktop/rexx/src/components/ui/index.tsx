import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-accent text-white hover:bg-orange-600 shadow-lg shadow-accent/20',
    secondary: 'bg-surface text-text-main hover:bg-neutral-800 border border-white/5',
    ghost: 'bg-transparent text-text-dim hover:text-text-main hover:bg-white/5',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    />
  );
};

export const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    className={`zen-glass rounded-2xl p-6 ${className}`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export const Input = ({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full bg-surface border border-white/5 rounded-xl px-4 py-2 text-text-main focus:outline-none focus:border-accent/50 transition-colors ${className}`}
    {...props}
  />
);

export { LoadingSpinner } from './LoadingSpinner';

