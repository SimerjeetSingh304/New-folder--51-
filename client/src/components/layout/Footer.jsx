import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      width: '100%',
      padding: '24px',
      marginTop: 'auto',
      borderTop: '1px solid var(--color-base-800)',
      background: 'rgba(9, 9, 11, 0.5)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      color: 'var(--color-base-400)',
      fontSize: '14px',
      textAlign: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        Built with <Heart size={14} style={{ color: 'var(--color-accent-500)', fill: 'var(--color-accent-500)' }} /> by Simerjeet Singh
      </div>
      <div style={{ fontSize: '12px', color: 'var(--color-base-600)' }}>
        © {new Date().getFullYear()} DevTracker. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
