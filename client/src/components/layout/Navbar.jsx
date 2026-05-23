import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { LayoutDashboard, BriefcaseBusiness, Lightbulb, Target, LogOut, Menu, X, Rocket, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/jobs', label: 'Jobs', icon: <BriefcaseBusiness size={18} /> },
    { path: '/aptitude', label: 'Aptitude', icon: <Lightbulb size={18} /> },
    { path: '/skills', label: 'Skills', icon: <Target size={18} /> },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: scrolled ? '16px 24px' : '24px',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none', // Allow clicking through the container
      }}
    >
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          pointerEvents: 'auto', // Re-enable pointer events for the nav itself
          background: scrolled ? 'rgba(24, 24, 27, 0.75)' : 'rgba(24, 24, 27, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: scrolled ? '0 12px 40px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '1000px',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          style={{
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '60px',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, var(--color-accent-500), var(--color-brand-purple))',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(168,85,247,0.3)',
              }}
            >
              <Rocket size={18} strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '18px',
                fontWeight: '700',
                color: 'var(--color-base-100)',
                letterSpacing: '-0.02em',
              }}
              className="logo-text"
            >
              DevTracker
            </span>
          </Link>

          {/* Desktop Nav */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'var(--color-base-950)',
              padding: '4px',
              borderRadius: '16px',
              border: '1px solid var(--color-base-800)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    textDecoration: 'none',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: active ? 'var(--color-base-100)' : 'var(--color-base-400)',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'color 0.2s',
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'var(--color-base-800)',
                        borderRadius: '12px',
                        zIndex: 0,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        border: '1px solid var(--color-base-700)'
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: active ? 'var(--color-accent-400)' : 'inherit' }}>{link.icon}</span>
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* User */}
            {user && (
              <div className="desktop-user">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 12px 4px 4px',
                    background: 'var(--color-base-950)',
                    border: '1px solid var(--color-base-800)',
                    borderRadius: '20px',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--color-base-800)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: 'var(--color-base-300)',
                      border: '1px solid var(--color-base-700)',
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span
                    style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-base-300)' }}
                  >
                    {user.name.split(' ')[0]}
                  </span>
                </div>
              </div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              style={{
                background: 'var(--color-base-950)',
                border: '1px solid var(--color-base-800)',
                color: 'var(--color-accent-400)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                borderRadius: '10px',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
              }}
              title="Toggle Theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            {user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="desktop-user"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-base-400)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  borderRadius: '10px',
                }}
              >
                <LogOut size={18} />
              </motion.button>
            )}

            {/* Mobile hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'var(--color-base-800)',
                border: '1px solid var(--color-base-700)',
                borderRadius: '10px',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-base-200)'
              }}
              className="hamburger"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              borderTop: '1px solid var(--color-base-800)',
              padding: '16px',
              overflow: 'hidden',
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: isActive(link.path) ? 'var(--color-base-100)' : 'var(--color-base-400)',
                  fontWeight: '600',
                  fontSize: '15px',
                  marginBottom: '6px',
                  background: isActive(link.path)
                    ? 'var(--color-base-800)'
                    : 'transparent',
                }}
              >
                <span style={{ color: isActive(link.path) ? 'var(--color-accent-400)' : 'inherit' }}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                style={{
                  width: '100%',
                  marginTop: '8px',
                  padding: '12px 16px',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: '12px',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <LogOut size={18} /> Logout
              </button>
            )}
          </motion.div>
        )}
      </motion.nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-user { display: none !important; }
          .hamburger { display: flex !important; }
          .logo-text { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Navbar;
