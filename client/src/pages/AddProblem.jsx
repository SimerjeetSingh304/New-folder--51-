import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lightbulb, Edit2 } from 'lucide-react';
import { dsaService } from '../services/dsaService';
import { useToast } from '../context/ToastContext';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input, { Select } from '../components/ui/Input';
import { APTITUDE_CATEGORIES, APTITUDE_DIFFICULTIES, APTITUDE_STATUSES, PLATFORMS } from '../utils/constants';

const AddProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '',
    platform: 'IndiaBix',
    difficulty: '',
    topic: '',
    status: 'Todo',
    link: '',
    timeToSolve: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchProblem = async () => {
        try {
          const res = await dsaService.getById(id);
          const p = res.data.data;
          setForm({
            title: p.title || '',
            platform: p.platform || 'IndiaBix',
            difficulty: p.difficulty || '',
            topic: p.topic || '',
            status: p.status || 'Todo',
            link: p.link || '',
            timeToSolve: p.timeToSolve?.toString() || '',
            notes: p.notes || '',
          });
        } catch {
          addToast('Failed to load problem', 'error');
          navigate('/aptitude');
        } finally {
          setFetching(false);
        }
      };
      fetchProblem();
    }
  }, [id, isEdit, navigate, addToast]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.difficulty) errs.difficulty = 'Difficulty is required';
    if (!form.topic) errs.topic = 'Topic is required';
    return errs;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const payload = {
        ...form,
        timeToSolve: form.timeToSolve ? parseInt(form.timeToSolve) : undefined,
      };
      if (isEdit) {
        await dsaService.update(id, payload);
        addToast('Problem updated!', 'success');
      } else {
        await dsaService.create(payload);
        addToast('Problem added!', 'success');
      }
      navigate('/aptitude');
    } catch (err) {
      addToast(err.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <PageWrapper>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <div className="skeleton" style={{ width: '100%', maxWidth: '640px', height: '420px', borderRadius: '24px' }} />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: '640px', margin: '0 auto' }}
      >
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: 'var(--color-base-100)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isEdit ? <Edit2 size={28} style={{ color: 'var(--color-accent-500)' }} /> : <Lightbulb size={28} style={{ color: 'var(--color-accent-500)' }} />}
            {isEdit ? 'Edit Problem' : 'Log Aptitude Problem'}
          </h1>
          <p style={{ margin: '6px 0 0', color: 'var(--color-base-400)', fontSize: '15px' }}>
            {isEdit ? 'Update problem details' : 'Track your aptitude practice progress'}
          </p>
        </div>

        <Card hover={false} padding="32px">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <Input
                label="Problem Title"
                name="title"
                id="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Number Series Pattern"
                error={errors.title}
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <Select label="Platform" name="platform" id="platform" value={form.platform} onChange={handleChange}>
                  {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </Select>
                <Select label="Difficulty" name="difficulty" id="difficulty" value={form.difficulty} onChange={handleChange} required error={errors.difficulty}>
                  <option value="">Select difficulty</option>
                  {APTITUDE_DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
                </Select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <Select label="Topic" name="topic" id="topic" value={form.topic} onChange={handleChange} required error={errors.topic}>
                  <option value="">Select topic</option>
                  {Object.entries(APTITUDE_CATEGORIES).map(([category, topics]) => (
                    <optgroup key={category} label={category}>
                      {topics.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </optgroup>
                  ))}
                </Select>
                <Select label="Status" name="status" id="status" value={form.status} onChange={handleChange}>
                  {APTITUDE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <Input
                  label="Problem Link"
                  name="link"
                  id="link"
                  value={form.link}
                  onChange={handleChange}
                  placeholder="https://indiabix.com/..."
                />
                <Input
                  label="Time to Solve (minutes)"
                  name="timeToSolve"
                  id="timeToSolve"
                  type="number"
                  min="1"
                  max="999"
                  value={form.timeToSolve}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                />
              </div>

              <Input
                as="textarea"
                label="Notes"
                name="notes"
                id="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Approach, formula, or revisit notes..."
                rows={4}
              />

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <Button variant="secondary" type="button" onClick={() => navigate('/aptitude')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} id="submit-problem">
                  {isEdit ? 'Update Problem' : 'Log Problem'}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </motion.div>
    </PageWrapper>
  );
};

export default AddProblem;
