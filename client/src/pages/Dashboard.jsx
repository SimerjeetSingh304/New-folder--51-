import { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, RadialBarChart, RadialBar, PolarAngleAxis
} from 'recharts';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2, Flame, Target, ExternalLink, Lightbulb, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { formatRelativeDate } from '../utils/dateUtils';
import { SKILLS_DATA } from '../utils/skillsData';
import { APTITUDE_DATA } from '../utils/aptitudeData';

const StatCard = ({ label, value, icon, color, sub }) => (
  <Card hover={true} style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-base-400)', fontWeight: '600' }}>{label}</p>
        <p style={{ margin: '12px 0 4px', fontSize: '36px', fontWeight: '800', color: 'var(--color-base-100)', lineHeight: 1 }}>
          {value ?? <SkeletonLine width="60px" height="36px" />}
        </p>
      </div>
      <div
        style={{
          width: '48px', height: '48px', borderRadius: '16px',
          background: `rgba(${color}, 0.1)`, border: `1px solid rgba(${color}, 0.2)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: `rgb(${color})`,
        }}
      >
        {icon}
      </div>
    </div>
    {sub && <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--color-base-400)', fontWeight: '500' }}>{sub}</p>}
  </Card>
);

const SkeletonLine = ({ width = '100%', height = '16px', style }) => (
  <div className="skeleton" style={{ width, height, ...style }} />
);

const SkeletonCard = () => (
  <Card hover={false} style={{ flex: '1 1 200px' }}>
    <SkeletonLine width="40%" height="14px" />
    <SkeletonLine width="50%" height="36px" style={{ marginTop: '16px' }} />
    <SkeletonLine width="60%" height="12px" style={{ marginTop: '12px' }} />
  </Card>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--color-base-900)', border: '1px solid var(--color-base-800)', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
        <p style={{ margin: 0, color: 'var(--color-base-400)', fontSize: '12px', fontWeight: '600' }}>{label}</p>
        <p style={{ margin: '4px 0 0', color: 'var(--color-base-100)', fontWeight: '700', fontSize: '18px' }}>
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

// Container variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load local static progress
  const skillsCompleted = useMemo(() => {
    try { return new Set(JSON.parse(localStorage.getItem('devtracker_skills_completed') || '[]')); } catch { return new Set(); }
  }, []);
  const aptitudeCompleted = useMemo(() => {
    try { return new Set(JSON.parse(localStorage.getItem('devtracker_aptitude_completed') || '[]')); } catch { return new Set(); }
  }, []);

  const totalSkills = SKILLS_DATA.length;
  const totalAptitude = APTITUDE_DATA.length;
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const jobBarData = stats
    ? Object.entries(stats.jobStats.byStatus).map(([name, value]) => ({ name, value }))
    : [];

  const CHART_COLORS = ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']; // purple, blue, green, amber, red

  // Circular progress data for the radial chart
  const progressData = [
    { name: 'Skills', value: Math.round((skillsCompleted.size / totalSkills) * 100) || 0, fill: '#3b82f6' },
    { name: 'Aptitude', value: Math.round((aptitudeCompleted.size / totalAptitude) * 100) || 0, fill: '#a855f7' }
  ];

  return (
    <PageWrapper>
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={itemVariants} style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: 'var(--color-base-100)', letterSpacing: '-0.02em' }}>
            Dashboard
          </h1>
          <p style={{ margin: '6px 0 0', color: 'var(--color-base-400)', fontSize: '15px' }}>
            Your placement prep overview.
          </p>
        </motion.div>

        {/* Bento Grid: Stat Cards */}
        <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          {loading ? (
            [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <StatCard
                label="Total Jobs Applied"
                value={stats?.jobStats.total ?? 0}
                icon={<Briefcase size={24} />}
                color="168, 85, 247" // purple
                sub={`${stats?.jobStats.last7Days ?? 0} this week`}
              />
              <StatCard
                label="Interviews"
                value={stats?.jobStats.byStatus.Interview ?? 0}
                icon={<Target size={24} />}
                color="59, 130, 246" // blue
                sub={`${stats?.jobStats.byStatus.Offer ?? 0} offers`}
              />
              <StatCard
                label="Curriculum Mastered"
                value={skillsCompleted.size + aptitudeCompleted.size}
                icon={<TrendingUp size={24} />}
                color="16, 185, 129" // emerald
                sub={`of ${totalSkills + totalAptitude} total topics`}
              />
              <StatCard
                label="Current Streak"
                value={`${stats?.streak ?? 0}`}
                icon={<Flame size={24} />}
                color="249, 115, 22" // orange
                sub="days active"
              />
            </>
          )}
        </motion.div>

        {/* Bento Grid: Charts & Lists */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
          
          {/* Charts Row */}
          <motion.div variants={itemVariants} style={{ gridColumn: 'span 12', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Bar Chart */}
            <Card hover={false}>
              <h3 style={{ margin: '0 0 24px', fontSize: '16px', fontWeight: '700', color: 'var(--color-base-100)' }}>
                Jobs by Status
              </h3>
              {loading ? (
                <SkeletonLine height="220px" />
              ) : jobBarData.every((d) => d.value === 0) ? (
                <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-base-600)', fontSize: '14px' }}>
                  No jobs yet. Add your first application!
                </div>
              ) : (
                <div style={{ height: '220px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={jobBarData} barSize={32}>
                      <XAxis dataKey="name" tick={{ fill: 'var(--color-base-400)', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tick={{ fill: 'var(--color-base-400)', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {jobBarData.map((entry, index) => (
                          <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>

            {/* Curriculum Progress Chart */}
            <Card hover={false}>
              <h3 style={{ margin: '0 0 24px', fontSize: '16px', fontWeight: '700', color: 'var(--color-base-100)' }}>
                Curriculum Progress
              </h3>
              <div style={{ height: '220px', display: 'flex' }}>
                <ResponsiveContainer width="60%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="50%" outerRadius="100%" barSize={14} data={progressData} startAngle={90} endAngle={-270}>
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar minAngle={15} background={{ fill: 'var(--color-base-800)' }} clockWise dataKey="value" cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px rgba(59,130,246,0.5)' }} />
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-base-400)', fontWeight: 600 }}>Skills</p>
                      <p style={{ margin: 0, fontSize: '16px', color: 'var(--color-base-100)', fontWeight: 800 }}>{progressData[0].value}%</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#a855f7', boxShadow: '0 0 8px rgba(168,85,247,0.5)' }} />
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-base-400)', fontWeight: 600 }}>Aptitude</p>
                      <p style={{ margin: 0, fontSize: '16px', color: 'var(--color-base-100)', fontWeight: 800 }}>{progressData[1].value}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Bottom Row */}
          <motion.div variants={itemVariants} style={{ gridColumn: 'span 12', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Recent Jobs */}
            <Card hover={false} padding="0">
              <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--color-base-800)' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: 'var(--color-base-100)' }}>
                  Recent Applications
                </h3>
              </div>
              <div style={{ padding: '0 24px 24px' }}>
                {loading ? (
                  [0, 1, 2].map((i) => (
                    <div key={i} style={{ borderBottom: '1px solid var(--color-base-800)', padding: '16px 0' }}>
                      <SkeletonLine width="60%" height="14px" />
                      <SkeletonLine width="40%" height="12px" style={{ marginTop: '8px' }} />
                    </div>
                  ))
                ) : !stats?.recentJobs?.length ? (
                  <p style={{ color: 'var(--color-base-500)', fontSize: '14px', marginTop: '24px' }}>No recent jobs.</p>
                ) : (
                  stats.recentJobs.map((job, index) => (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 0',
                        borderBottom: index !== stats.recentJobs.length - 1 ? '1px solid var(--color-base-800)' : 'none',
                      }}
                    >
                      <div>
                        <p style={{ margin: 0, fontWeight: '600', color: 'var(--color-base-200)', fontSize: '15px' }}>
                          {job.company}
                        </p>
                        <p style={{ margin: '4px 0 0', color: 'var(--color-base-400)', fontSize: '13px' }}>
                          {job.role} · {formatRelativeDate(job.createdAt)}
                        </p>
                      </div>
                      <Badge label={job.status} type="job-status" />
                    </motion.div>
                  ))
                )}
              </div>
            </Card>

            {/* Quick Links */}
            <Card hover={false} padding="0">
              <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--color-base-800)' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: 'var(--color-base-100)' }}>
                  Quick Actions
                </h3>
              </div>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Link to="/jobs/add" style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--color-base-950)', border: '1px solid var(--color-base-800)', padding: '16px', borderRadius: '16px', transition: 'all 0.2s', cursor: 'pointer' }} className="hover-lift">
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <p style={{ margin: 0, color: 'var(--color-base-100)', fontWeight: 600, fontSize: '15px' }}>Log New Application</p>
                      <p style={{ margin: '4px 0 0', color: 'var(--color-base-400)', fontSize: '13px' }}>Track an interview or offer.</p>
                    </div>
                  </div>
                </Link>

                <Link to="/skills" style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--color-base-950)', border: '1px solid var(--color-base-800)', padding: '16px', borderRadius: '16px', transition: 'all 0.2s', cursor: 'pointer' }} className="hover-lift">
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(168,85,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7' }}>
                      <Target size={20} />
                    </div>
                    <div>
                      <p style={{ margin: 0, color: 'var(--color-base-100)', fontWeight: 600, fontSize: '15px' }}>Continue Skills Roadmap</p>
                      <p style={{ margin: '4px 0 0', color: 'var(--color-base-400)', fontSize: '13px' }}>Pick up where you left off.</p>
                    </div>
                  </div>
                </Link>

                <Link to="/aptitude" style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--color-base-950)', border: '1px solid var(--color-base-800)', padding: '16px', borderRadius: '16px', transition: 'all 0.2s', cursor: 'pointer' }} className="hover-lift">
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                      <Lightbulb size={20} />
                    </div>
                    <div>
                      <p style={{ margin: 0, color: 'var(--color-base-100)', fontWeight: 600, fontSize: '15px' }}>Practice Aptitude</p>
                      <p style={{ margin: '4px 0 0', color: 'var(--color-base-400)', fontSize: '13px' }}>Master quantitative reasoning.</p>
                    </div>
                  </div>
                </Link>
              </div>
            </Card>
          </motion.div>

        </div>
      </motion.div>
    </PageWrapper>
  );
};

export default Dashboard;
