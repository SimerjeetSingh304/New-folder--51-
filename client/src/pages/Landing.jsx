import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, BriefcaseBusiness, BrainCircuit, Target, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const features = [
    {
      icon: <BriefcaseBusiness size={24} style={{ color: 'var(--color-brand-blue)' }} />,
      title: 'Job Tracking',
      desc: 'Keep tabs on applications, upcoming interviews, and offer statuses all in a Kanban-style dashboard.'
    },
    {
      icon: <BrainCircuit size={24} style={{ color: 'var(--color-brand-purple)' }} />,
      title: 'Aptitude Practice',
      desc: 'Log and track your progress across critical aptitude topics like patterns, arrangements, and quantitative reasoning.'
    },
    {
      icon: <Target size={24} style={{ color: 'var(--color-accent-400)' }} />,
      title: '64-Day Skill Tree',
      desc: 'Follow a structured daily roadmap to master full-stack development and ace your technical interviews.'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'transparent',
    }}>
      {/* Navbar for Landing */}
      {!isAuthenticated && (
        <nav style={{
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, var(--color-accent-500), var(--color-brand-purple))',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(168,85,247,0.3)',
            }}>
              <Rocket size={20} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-base-100)', letterSpacing: '-0.02em' }}>
              DevTracker
            </span>
          </div>
          <div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="secondary">Sign In</Button>
              </Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </nav>
      )}

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          style={{ maxWidth: '800px', textAlign: 'center', margin: '0 auto' }}
        >
          <motion.div variants={itemVariants} style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            borderRadius: '20px', color: 'var(--color-brand-purple)',
            fontSize: '14px', fontWeight: '600', marginBottom: '24px'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-brand-purple)' }} />
            The Ultimate Placement Prep Tool
          </motion.div>

          <motion.h1 variants={itemVariants} style={{
            fontSize: 'clamp(40px, 6vw, 64px)',
            fontWeight: '800',
            color: 'var(--color-base-100)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '24px'
          }}>
            Track your journey to your <span className="gradient-text">dream job.</span>
          </motion.h1>

          <motion.p variants={itemVariants} style={{
            fontSize: '18px',
            color: 'var(--color-base-400)',
            lineHeight: 1.6,
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px'
          }}>
            DevTracker is a unified dashboard for developers. Manage your job applications, log aptitude practice, and master your technical skills all in one beautiful platform.
          </motion.p>

          <motion.div variants={itemVariants} style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={isAuthenticated ? '/dashboard' : '/register'} style={{ textDecoration: 'none' }}>
              <Button style={{ padding: '16px 32px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Start Tracking Free <ChevronRight size={18} />
              </Button>
            </Link>
            <a href="#features" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" style={{ padding: '16px 32px', fontSize: '16px' }}>
                Explore Features
              </Button>
            </a>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          id="features"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            maxWidth: '1000px',
            width: '100%',
            marginTop: '80px'
          }}
        >
          {features.map((feat, i) => (
            <motion.div key={i} variants={itemVariants} className="glass-card" style={{
              padding: '32px',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '16px',
                background: 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {feat.icon}
              </div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: 'var(--color-base-100)' }}>
                {feat.title}
              </h3>
              <p style={{ margin: 0, color: 'var(--color-base-400)', lineHeight: 1.6, fontSize: '15px' }}>
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Social Proof */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{ marginTop: '80px', textAlign: 'center', paddingBottom: '40px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--color-success-500)', fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
             <CheckCircle2 size={16} /> Production Ready
          </div>
          <p style={{ color: 'var(--color-base-500)', fontSize: '14px' }}>Built with React, Framer Motion, and Tailwind CSS.</p>
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;
