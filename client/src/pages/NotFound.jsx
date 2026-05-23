import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileQuestion } from 'lucide-react';
import Button from '../components/ui/Button';
import PageWrapper from '../components/layout/PageWrapper';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          textAlign: 'center',
          background: 'var(--color-glass)',
          border: '1px solid var(--color-glass-border)',
          borderRadius: '24px',
          padding: '64px 40px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 8px 32px var(--color-shadow)',
          backdropFilter: 'blur(24px)'
        }}
      >
        <div style={{
          width: '80px', height: '80px', borderRadius: '24px',
          background: 'rgba(168,85,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--color-brand-purple)', margin: '0 auto 24px', border: '1px solid rgba(168,85,247,0.2)'
        }}>
          <FileQuestion size={40} />
        </div>
        <h1 className="gradient-text" style={{ fontSize: '72px', fontWeight: '900', margin: '0 0 8px', lineHeight: 1 }}>
          404
        </h1>
        <h2 style={{ margin: '0 0 16px', color: 'var(--color-base-100)', fontSize: '24px', fontWeight: '700' }}>Lost in Space?</h2>
        <p style={{ margin: '0 0 32px', color: 'var(--color-base-400)', fontSize: '15px', lineHeight: 1.6 }}>
          The page you're looking for doesn't exist, was moved, or you just took a wrong turn at Albuquerque.
        </p>
        <Button onClick={() => navigate('/')} style={{ padding: '14px 32px', fontSize: '15px' }}>
          Back to Dashboard
        </Button>
      </motion.div>
    </PageWrapper>
  );
};

export default NotFound;
