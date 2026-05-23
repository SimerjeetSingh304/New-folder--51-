import { motion } from 'framer-motion';

const PageWrapper = ({ children, style, className = '' }) => (
  <motion.main
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    className={className}
    style={{
      maxWidth: '1000px', // slightly narrower for a sleek bento look
      margin: '0 auto',
      padding: '40px 24px',
      minHeight: 'calc(100vh - 80px)',
      ...style,
    }}
  >
    {children}
  </motion.main>
);

export default PageWrapper;
