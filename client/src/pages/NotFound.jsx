import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      padding: '24px',
      background: 'radial-gradient(ellipse at top, #1a0a3b 0%, #0f172a 60%)',
    }}>
      <div className="animate-fadeIn">
        <div style={{ fontSize: '80px', marginBottom: '16px' }}>🚫</div>
        <h1 style={{ fontSize: '80px', fontWeight: '900', margin: '0 0 8px', background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          404
        </h1>
        <h2 style={{ margin: '0 0 12px', color: '#f1f5f9', fontSize: '22px' }}>Page Not Found</h2>
        <p style={{ margin: '0 0 32px', color: '#64748b', maxWidth: '360px' }}>
          The page you're looking for doesn't exist or was moved.
        </p>
        <Button onClick={() => navigate('/')}>Go to Dashboard</Button>
      </div>
    </div>
  );
};

export default NotFound;
