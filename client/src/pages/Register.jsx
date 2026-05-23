import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await authService.register(form);
      login(res.data.token, res.data.user);
      addToast(`Welcome to DevTracker, ${res.data.user.name}! 🎉`, 'success');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      addToast(msg, 'error');
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at center top, rgba(168, 85, 247, 0.15) 0%, var(--color-base-950) 60%)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{ width: '100%', maxWidth: '420px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 0.1 }}
            style={{
              width: '64px', height: '64px',
              background: 'linear-gradient(135deg, var(--color-brand-purple), var(--color-brand-blue))',
              borderRadius: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 32px rgba(168,85,247,0.3)',
              color: '#fff'
            }}
          >
            <Rocket size={32} strokeWidth={2.5} />
          </motion.div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: 'var(--color-base-100)', letterSpacing: '-0.02em' }}>
            Join DevTracker
          </h1>
          <p style={{ margin: '8px 0 0', color: 'var(--color-base-400)', fontSize: '15px' }}>
            Start tracking your placement prep
          </p>
        </div>

        <div className="glass-card" style={{ padding: '36px', borderRadius: '24px' }}>
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '12px', padding: '12px 16px',
                color: 'var(--color-danger-400)', fontSize: '14px', marginBottom: '24px',
                fontWeight: 500,
              }}
            >
              {errors.general}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Input
                label="Full Name"
                name="name"
                id="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                error={errors.name}
                required
              />
              <Input
                label="Email"
                name="email"
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                error={errors.email}
                required
              />
              <Input
                label="Password"
                name="password"
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                error={errors.password}
                required
              />
              <div style={{ marginTop: '8px' }}>
                <Button
                  type="submit"
                  loading={loading}
                  id="register-btn"
                  style={{ width: '100%', padding: '14px', fontSize: '15px' }}
                >
                  Create Account
                </Button>
              </div>
            </div>
          </form>

          <p style={{ textAlign: 'center', marginTop: '32px', color: 'var(--color-base-400)', fontSize: '14px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-accent-400)', fontWeight: '600', textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
