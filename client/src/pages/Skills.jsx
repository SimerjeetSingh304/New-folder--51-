import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, Hourglass, TrendingUp, ChevronDown, Search, SearchX } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import { SKILLS_DATA, SKILL_CATEGORIES, CATEGORY_COLORS } from '../utils/skillsData';

const STORAGE_KEY = 'devtracker_skills_completed';

const loadCompleted = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

const saveCompleted = (set) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const Skills = () => {
  const [completed, setCompleted] = useState(loadCompleted);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedDay, setExpandedDay] = useState(null);

  const toggleDay = (day) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      saveCompleted(next);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return SKILLS_DATA.filter((s) => {
      const catMatch = activeCategory === 'All' || s.category === activeCategory;
      const searchMatch =
        !search ||
        s.topic.toLowerCase().includes(search.toLowerCase()) ||
        s.subtopics.toLowerCase().includes(search.toLowerCase());
      return catMatch && searchMatch;
    });
  }, [activeCategory, search]);

  const totalDays = SKILLS_DATA.length;
  const completedCount = completed.size;
  const remainingCount = totalDays - completedCount;
  const overallPct = Math.round((completedCount / totalDays) * 100);

  const catStats = useMemo(() => {
    return SKILL_CATEGORIES.filter((c) => c !== 'All').map((cat) => {
      const days = SKILLS_DATA.filter((s) => s.category === cat);
      const done = days.filter((s) => completed.has(s.day)).length;
      return { cat, total: days.length, done, pct: days.length > 0 ? Math.round((done / days.length) * 100) : 0 };
    });
  }, [completed]);

  const catStyle = (cat) => {
    return CATEGORY_COLORS[cat] || CATEGORY_COLORS['Mock'];
  };

  return (
    <PageWrapper>
      <motion.div initial="hidden" animate="show" variants={containerVariants}>
        
        {/* Header */}
        <motion.div variants={itemVariants} style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: 'var(--color-base-100)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Target size={28} style={{ color: 'var(--color-accent-500)' }} />
            Skills Tracker
          </h1>
          <p style={{ margin: '6px 0 0', color: 'var(--color-base-400)', fontSize: '15px' }}>
            64-day placement prep. Track your learning progress and stay consistent.
          </p>
        </motion.div>

        {/* Bento Grid: Summary Stats */}
        <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Days', value: totalDays, color: '168, 85, 247', icon: <Target size={24} /> },
            { label: 'Completed', value: completedCount, color: '16, 185, 129', icon: <CheckCircle2 size={24} /> },
            { label: 'Remaining', value: remainingCount, color: '249, 115, 22', icon: <Hourglass size={24} /> },
            { label: 'Progress', value: `${overallPct}%`, color: '59, 130, 246', icon: <TrendingUp size={24} /> },
          ].map(({ label, value, color, icon }) => (
            <Card key={label} hover={false} padding="20px" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: `rgba(${color}, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: `rgb(${color})`, border: `1px solid rgba(${color}, 0.2)`
                }}>
                  {icon}
                </div>
                <span style={{ fontSize: '13px', color: 'var(--color-base-400)', fontWeight: '600' }}>{label}</span>
              </div>
              <p style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: 'var(--color-base-100)', lineHeight: 1 }}>{value}</p>
            </Card>
          ))}
        </motion.div>

        {/* Overall Progress Bar */}
        <motion.div variants={itemVariants}>
          <Card hover={false} style={{ marginBottom: '24px' }} padding="24px">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-base-100)' }}>
                Overall Progress
              </span>
              <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-brand-purple)' }}>
                {completedCount} of {totalDays} days completed
              </span>
            </div>
            <div style={{ height: '10px', background: 'var(--color-base-800)', borderRadius: '5px', overflow: 'hidden', marginBottom: '24px' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--color-brand-purple), var(--color-brand-blue))',
                  borderRadius: '5px'
                }}
              />
            </div>

            {/* Per-category bars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {catStats.map(({ cat, total, done, pct }) => {
                const c = catStyle(cat);
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '12px', fontWeight: '600',
                        color: c.text, background: c.bg,
                        border: `1px solid ${c.border}`,
                        padding: '2px 8px', borderRadius: '20px',
                      }}>{cat}</span>
                      <span style={{ fontSize: '12px', color: 'var(--color-base-400)', fontWeight: 500 }}>{done}/{total}</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--color-base-800)', borderRadius: '3px', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8 }}
                        style={{ height: '100%', background: c.border, borderRadius: '3px' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Category Tabs + Search */}
        <motion.div variants={itemVariants}>
          <Card hover={false} padding="16px" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
                {SKILL_CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  const c = cat !== 'All' ? catStyle(cat) : null;
                  return (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '12px',
                        border: `1px solid ${isActive ? (c?.border || 'var(--color-accent-500)') : 'var(--color-base-800)'}`,
                        background: isActive ? (c?.bg || 'rgba(168, 85, 247, 0.1)') : 'transparent',
                        color: isActive ? (c?.text || 'var(--color-accent-400)') : 'var(--color-base-400)',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                        boxShadow: isActive ? `inset 0 0 0 1px ${c ? c.bg : 'rgba(168,85,247,0.2)'}` : 'none'
                      }}
                    >
                      {cat}
                    </motion.button>
                  );
                })}
              </div>
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-base-500)' }} />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 36px',
                    background: 'var(--color-base-950)',
                    border: '1px solid var(--color-base-800)',
                    borderRadius: '12px',
                    color: 'var(--color-base-100)',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-accent-500)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-base-800)'}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Skills List */}
        <motion.div layout style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div key="empty" variants={itemVariants} exit="exit" layout>
                <Card hover={false} style={{ textAlign: 'center', padding: '64px 24px', borderStyle: 'dashed' }}>
                  <SearchX size={48} style={{ color: 'var(--color-base-600)', margin: '0 auto 16px' }} />
                  <h3 style={{ margin: '0 0 8px', color: 'var(--color-base-100)', fontSize: '20px' }}>No skills match your filter</h3>
                  <p style={{ margin: 0, color: 'var(--color-base-400)' }}>Try adjusting your search or category.</p>
                </Card>
              </motion.div>
            ) : (
              filtered.map((skill) => {
                const isDone = completed.has(skill.day);
                const c = catStyle(skill.category);
                const isExpanded = expandedDay === skill.day;

                return (
                  <motion.div
                    key={skill.day}
                    variants={itemVariants}
                    layout
                    style={{
                      background: isDone ? 'var(--color-base-950)' : 'rgba(24, 24, 27, 0.4)',
                      border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.2)' : 'var(--color-base-800)'}`,
                      borderRadius: '16px',
                      padding: '20px',
                      transition: 'all 0.2s',
                      opacity: isDone ? 0.75 : 1,
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      {/* Checkbox */}
                      <motion.div
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleDay(skill.day)}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '8px',
                          border: `2px solid ${isDone ? 'var(--color-success-500)' : 'var(--color-base-600)'}`,
                          background: isDone ? 'var(--color-success-500)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0,
                          marginTop: '2px',
                          transition: 'all 0.2s',
                        }}
                      >
                        <AnimatePresence>
                          {isDone && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                            >
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M3 7.5L5.5 10L11 4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', cursor: 'pointer' }}
                          onClick={() => setExpandedDay(isExpanded ? null : skill.day)}
                        >
                          {/* Day badge */}
                          <span style={{
                            fontSize: '11px', fontWeight: '700',
                            color: 'var(--color-base-300)', background: 'var(--color-base-800)',
                            border: '1px solid var(--color-base-700)',
                            padding: '4px 10px', borderRadius: '8px',
                            flexShrink: 0,
                            letterSpacing: '0.02em'
                          }}>
                            DAY {skill.day}
                          </span>

                          {/* Category badge */}
                          <span style={{
                            fontSize: '11px', fontWeight: '700',
                            color: c.text, background: c.bg,
                            border: `1px solid ${c.border}`,
                            padding: '4px 10px', borderRadius: '8px',
                            flexShrink: 0,
                            letterSpacing: '0.02em'
                          }}>
                            {skill.category.toUpperCase()}
                          </span>

                          {/* Topic */}
                          <span style={{
                            fontWeight: '700',
                            color: isDone ? 'var(--color-base-500)' : 'var(--color-base-100)',
                            fontSize: '16px',
                            textDecoration: isDone ? 'line-through' : 'none',
                            flex: 1,
                            letterSpacing: '-0.01em'
                          }}>
                            {skill.topic}
                          </span>

                          {/* Expand arrow */}
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            style={{ color: 'var(--color-base-500)', display: 'flex', alignItems: 'center' }}
                          >
                            <ChevronDown size={20} />
                          </motion.div>
                        </div>

                        {/* Subtopics — expandable */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0, marginTop: 0 }}
                              animate={{ height: 'auto', opacity: 1, marginTop: '16px' }}
                              exit={{ height: 0, opacity: 0, marginTop: 0 }}
                              style={{ overflow: 'hidden' }}
                            >
                              <div style={{
                                padding: '16px',
                                background: 'var(--color-base-950)',
                                borderRadius: '12px',
                                border: '1px solid var(--color-base-800)',
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '8px'
                              }}>
                                {skill.subtopics.split(' · ').map((sub, i) => (
                                  <span key={i} style={{
                                    display: 'inline-block',
                                    background: 'var(--color-base-900)',
                                    border: '1px solid var(--color-base-800)',
                                    borderRadius: '8px',
                                    padding: '4px 10px',
                                    color: 'var(--color-base-300)',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                  }}>
                                    {sub}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer count */}
        {filtered.length > 0 && (
          <motion.p variants={itemVariants} style={{ textAlign: 'center', color: 'var(--color-base-500)', fontSize: '13px', marginTop: '32px', fontWeight: 500 }}>
            Showing {filtered.length} of {totalDays} skills
          </motion.p>
        )}
      </motion.div>
    </PageWrapper>
  );
};

export default Skills;
