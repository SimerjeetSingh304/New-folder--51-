import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BriefcaseBusiness, Plus, Search, Link as LinkIcon, Edit2, Trash2, MapPin, Banknote, Calendar, Inbox } from 'lucide-react';
import { jobService } from '../services/jobService';
import { useToast } from '../context/ToastContext';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { JOB_STATUSES } from '../utils/constants';
import { formatDate } from '../utils/dateUtils';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

const Jobs = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sort, setSort] = useState('appliedDate_desc');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await jobService.getAll({
        status: statusFilter === 'All' ? undefined : statusFilter,
        search: debouncedSearch || undefined,
        sort,
      });
      setJobs(res.data.data);
    } catch {
      addToast('Failed to load jobs', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedSearch, sort, addToast]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await jobService.delete(deleteId);
      addToast('Job deleted successfully', 'success');
      setDeleteId(null);
      fetchJobs();
    } catch {
      addToast('Failed to delete job', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const statusCounts = JOB_STATUSES.reduce((acc, s) => {
    acc[s] = jobs.filter((j) => j.status === s).length;
    return acc;
  }, {});

  const filterBtnStyle = (active) => ({
    padding: '8px 16px',
    borderRadius: '12px',
    border: `1px solid ${active ? 'var(--color-accent-500)' : 'var(--color-base-800)'}`,
    background: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
    color: active ? 'var(--color-accent-400)' : 'var(--color-base-400)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
    boxShadow: active ? 'inset 0 0 0 1px rgba(99, 102, 241, 0.2)' : 'none',
  });

  return (
    <PageWrapper>
      <motion.div initial="hidden" animate="show" variants={containerVariants}>
        
        {/* Header */}
        <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: 'var(--color-base-100)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <BriefcaseBusiness size={28} className="text-accent-500" style={{ color: 'var(--color-accent-500)' }} />
              Job Applications
            </h1>
            <p style={{ margin: '6px 0 0', color: 'var(--color-base-400)', fontSize: '15px' }}>
              Tracking {jobs.length} application{jobs.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={() => navigate('/jobs/add')}>
            <Plus size={18} /> Add Job
          </Button>
        </motion.div>

        {/* Filters and Search Bar */}
        <motion.div variants={itemVariants}>
          <Card padding="16px" style={{ marginBottom: '24px' }} hover={false}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
                {['All', ...JOB_STATUSES].map((s) => (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    style={filterBtnStyle(statusFilter === s)}
                  >
                    {s} {s !== 'All' && <span style={{ opacity: 0.6, marginLeft: '4px' }}>({statusCounts[s] ?? 0})</span>}
                  </motion.button>
                ))}
              </div>

              <div style={{ position: 'relative', width: '240px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-base-500)' }} />
                <input
                  type="text"
                  placeholder="Search company or role..."
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

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{
                  padding: '10px 14px',
                  background: 'var(--color-base-950)',
                  border: '1px solid var(--color-base-800)',
                  borderRadius: '12px',
                  color: 'var(--color-base-200)',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  outline: 'none',
                  appearance: 'none',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                <option value="appliedDate_desc">Newest First</option>
                <option value="appliedDate_asc">Oldest First</option>
                <option value="company_asc">Company A-Z</option>
              </select>
            </div>
          </Card>
        </motion.div>

        {/* Job Cards */}
        <motion.div layout style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AnimatePresence mode="popLayout">
            {loading ? (
              [0, 1, 2].map((i) => (
                <motion.div key={`skeleton-${i}`} variants={itemVariants} exit="exit">
                  <Card hover={false}>
                    <div className="skeleton" style={{ height: '24px', width: '30%', marginBottom: '16px' }} />
                    <div className="skeleton" style={{ height: '16px', width: '50%' }} />
                  </Card>
                </motion.div>
              ))
            ) : jobs.length === 0 ? (
              <motion.div key="empty" variants={itemVariants} exit="exit" layout>
                <Card hover={false} style={{ textAlign: 'center', padding: '80px 24px', borderStyle: 'dashed' }}>
                  <Inbox size={48} style={{ color: 'var(--color-base-600)', margin: '0 auto 16px' }} />
                  <h3 style={{ margin: '0 0 8px', color: 'var(--color-base-100)', fontSize: '20px' }}>No jobs found</h3>
                  <p style={{ margin: '0 0 24px', color: 'var(--color-base-400)' }}>
                    {statusFilter !== 'All' || debouncedSearch
                      ? 'Try adjusting your search or filters.'
                      : 'You haven\'t added any job applications yet.'}
                  </p>
                  {!debouncedSearch && statusFilter === 'All' && (
                    <Button onClick={() => navigate('/jobs/add')}>
                      <Plus size={18} /> Add First Job
                    </Button>
                  )}
                </Card>
              </motion.div>
            ) : (
              jobs.map((job) => (
                <motion.div key={job._id} variants={itemVariants} exit="exit" layout>
                  <Card hover={true}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                      <div style={{ flex: 1, minWidth: '240px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: 'var(--color-base-100)', letterSpacing: '-0.01em' }}>
                            {job.company}
                          </h3>
                          <Badge label={job.status} type="job-status" />
                        </div>
                        <p style={{ margin: '0 0 12px', color: 'var(--color-base-300)', fontSize: '15px', fontWeight: '500' }}>
                          {job.role}
                        </p>
                        
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: job.notes ? '12px' : '0' }}>
                          {job.location && (
                            <span style={{ color: 'var(--color-base-400)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={14} /> {job.location}
                            </span>
                          )}
                          {job.salary && (
                            <span style={{ color: 'var(--color-base-400)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Banknote size={14} /> {job.salary}
                            </span>
                          )}
                          <span style={{ color: 'var(--color-base-400)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={14} /> {formatDate(job.appliedDate)}
                          </span>
                        </div>

                        {job.notes && (
                          <p style={{
                            margin: 0,
                            padding: '12px',
                            background: 'var(--color-base-950)',
                            borderRadius: '8px',
                            border: '1px solid var(--color-base-800)',
                            color: 'var(--color-base-400)',
                            fontSize: '13px',
                            lineHeight: 1.5,
                          }}>
                            {job.notes}
                          </p>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        {job.link && (
                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={job.link}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              padding: '8px',
                              background: 'var(--color-base-800)',
                              border: '1px solid var(--color-base-700)',
                              borderRadius: '10px',
                              color: 'var(--color-base-200)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <LinkIcon size={16} />
                          </motion.a>
                        )}
                        <Button variant="secondary" size="icon" onClick={() => navigate(`/jobs/${job._id}/edit`)}>
                          <Edit2 size={16} />
                        </Button>
                        <Button variant="danger" size="icon" onClick={() => setDeleteId(job._id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

      </motion.div>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Job Application">
        <p style={{ color: 'var(--color-base-400)', fontSize: '15px', margin: '0 0 24px', lineHeight: 1.5 }}>
          Are you sure you want to delete this job application? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default Jobs;
