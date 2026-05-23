import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BriefcaseBusiness, Edit2 } from 'lucide-react';
import { jobService } from '../services/jobService';
import { useToast } from '../context/ToastContext';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input, { Select } from '../components/ui/Input';
import { JOB_STATUSES } from '../utils/constants';

const today = () => new Date().toISOString().split('T')[0];

const AddJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const isEdit = !!id;

  const [form, setForm] = useState({
    company: '',
    role: '',
    status: 'Applied',
    appliedDate: today(),
    link: '',
    salary: '',
    location: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchJob = async () => {
        try {
          const res = await jobService.getById(id);
          const j = res.data.data;
          setForm({
            company: j.company || '',
            role: j.role || '',
            status: j.status || 'Applied',
            appliedDate: j.appliedDate?.split('T')[0] || today(),
            link: j.link || '',
            salary: j.salary || '',
            location: j.location || '',
            notes: j.notes || '',
          });
        } catch {
          addToast('Failed to load job details', 'error');
          navigate('/jobs');
        } finally {
          setFetching(false);
        }
      };
      fetchJob();
    }
  }, [id, isEdit, navigate, addToast]);

  const validate = () => {
    const errs = {};
    if (!form.company.trim()) errs.company = 'Company is required';
    if (!form.role.trim()) errs.role = 'Role is required';
    return errs;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await jobService.update(id, form);
        addToast('Job updated successfully!', 'success');
      } else {
        await jobService.create(form);
        addToast('Job added successfully!', 'success');
      }
      navigate('/jobs');
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
          <div className="skeleton" style={{ width: '100%', maxWidth: '640px', height: '400px', borderRadius: '24px' }} />
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
            {isEdit ? <Edit2 size={28} style={{ color: 'var(--color-accent-500)' }} /> : <BriefcaseBusiness size={28} style={{ color: 'var(--color-accent-500)' }} />}
            {isEdit ? 'Edit Job' : 'Add Application'}
          </h1>
          <p style={{ margin: '6px 0 0', color: 'var(--color-base-400)', fontSize: '15px' }}>
            {isEdit ? 'Update the details below' : 'Track a new job application'}
          </p>
        </div>

        <Card hover={false} padding="32px">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <Input
                  label="Company"
                  name="company"
                  id="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="e.g. Google"
                  error={errors.company}
                  required
                />
                <Input
                  label="Role"
                  name="role"
                  id="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="e.g. SDE Intern"
                  error={errors.role}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <Select
                  label="Status"
                  name="status"
                  id="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  {JOB_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
                <Input
                  label="Applied Date"
                  name="appliedDate"
                  id="appliedDate"
                  type="date"
                  value={form.appliedDate}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <Input
                  label="Salary"
                  name="salary"
                  id="salary"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="e.g. ₹12 LPA"
                />
                <Input
                  label="Location"
                  name="location"
                  id="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore"
                />
              </div>

              <Input
                label="Job Link"
                name="link"
                id="link"
                value={form.link}
                onChange={handleChange}
                placeholder="https://..."
              />

              <Input
                as="textarea"
                label="Notes"
                name="notes"
                id="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Interview rounds, referral info, etc."
                rows={4}
              />

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => navigate('/jobs')}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={loading} id="submit-job">
                  {isEdit ? 'Update Job' : 'Add Job'}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </motion.div>
    </PageWrapper>
  );
};

export default AddJob;
