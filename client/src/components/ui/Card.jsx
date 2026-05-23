import { motion } from 'framer-motion';

const Card = ({
  children,
  style,
  onClick,
  hover = true,
  padding = '24px',
  className = '',
}) => {
  const isClickable = !!onClick;

  return (
    <motion.div
      onClick={onClick}
      className={`glass-card ${className}`}
      whileHover={hover ? { y: -2, boxShadow: '0 12px 40px rgba(0,0,0,0.2)' } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        borderRadius: '20px', // slightly softer bento-style corners
        padding,
        cursor: isClickable ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};

export default Card;
