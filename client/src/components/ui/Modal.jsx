import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = '480px' }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(9, 9, 11, 0.8)', // base-950 with opacity
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-card"
            style={{
              padding: '28px',
              width: '100%',
              maxWidth,
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
              borderRadius: '24px',
            }}
          >
            {title && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '24px',
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '700',
                    color: 'var(--color-base-100)',
                  }}
                >
                  {title}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: 'var(--color-base-700)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  style={{
                    background: 'var(--color-base-800)',
                    border: 'none',
                    borderRadius: '10px',
                    width: '32px',
                    height: '32px',
                    color: 'var(--color-base-400)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={18} />
                </motion.button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
