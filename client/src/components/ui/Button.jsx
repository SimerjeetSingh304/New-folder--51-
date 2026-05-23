import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const sizeStyles = {
  sm: { padding: '6px 14px', fontSize: '13px', borderRadius: '8px' },
  md: { padding: '10px 20px', fontSize: '14px', borderRadius: '10px' },
  lg: { padding: '12px 28px', fontSize: '15px', borderRadius: '12px' },
  icon: { padding: '8px', borderRadius: '10px' },
};

const variantStyles = {
  primary: {
    background: 'linear-gradient(135deg, var(--color-accent-500), var(--color-brand-purple))',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
  },
  secondary: {
    background: 'rgba(39, 39, 42, 0.5)', /* base-800 with opacity */
    color: 'var(--color-base-100)',
    border: '1px solid var(--color-base-700)',
    backdropFilter: 'blur(8px)',
  },
  danger: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-base-400)',
    border: '1px solid transparent',
  },
};

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  children,
  type = 'button',
  style: extraStyle,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.97 } : {}}
      className="focus-ring"
      style={{
        ...sizeStyles[size],
        ...variantStyles[variant],
        fontWeight: '500',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.6 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'background 0.2s, color 0.2s, border-color 0.2s',
        fontFamily: 'inherit',
        position: 'relative',
        overflow: 'hidden',
        ...extraStyle,
      }}
      {...rest}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </motion.button>
  );
};

export default Button;
