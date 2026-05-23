import { motion } from 'framer-motion';

const Input = ({
  label,
  error,
  placeholder,
  type = 'text',
  value,
  onChange,
  required,
  id,
  name,
  min,
  max,
  step,
  rows,
  as: Tag = 'input',
}) => {
  const isTextarea = Tag === 'textarea';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative' }}>
      {label && (
        <label
          htmlFor={id || name}
          style={{
            fontSize: '13px',
            fontWeight: '500',
            color: 'var(--color-base-400)',
            display: 'flex',
            gap: '4px',
            marginLeft: '4px',
          }}
        >
          {label}
          {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        <Tag
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
          rows={rows}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'var(--color-base-900)',
            border: `1px solid ${error ? '#ef4444' : 'var(--color-base-800)'}`,
            borderRadius: '12px',
            color: 'var(--color-base-100)',
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'background 0.2s, box-shadow 0.2s',
            resize: isTextarea ? 'vertical' : undefined,
            minHeight: isTextarea ? '100px' : undefined,
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
          }}
          onFocus={(e) => {
            e.target.style.background = 'var(--color-base-950)';
            e.target.style.borderColor = error ? '#ef4444' : 'var(--color-accent-500)';
            e.target.style.boxShadow = error
              ? 'inset 0 2px 4px rgba(0,0,0,0.2), 0 0 0 3px rgba(239,68,68,0.15)'
              : 'inset 0 2px 4px rgba(0,0,0,0.2), 0 0 0 3px rgba(99,102,241,0.2)';
          }}
          onBlur={(e) => {
            e.target.style.background = 'var(--color-base-900)';
            e.target.style.borderColor = error ? '#ef4444' : 'var(--color-base-800)';
            e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
          }}
        />
      </div>

      {error && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ color: '#ef4444', fontSize: '12px', marginTop: '2px', marginLeft: '4px' }}
        >
          {error}
        </motion.span>
      )}
    </div>
  );
};

// Select wrapper
export const Select = ({
  label,
  error,
  value,
  onChange,
  required,
  id,
  name,
  children,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {label && (
      <label
        htmlFor={id || name}
        style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-base-400)', marginLeft: '4px' }}
      >
        {label}
        {required && <span style={{ color: '#ef4444' }}> *</span>}
      </label>
    )}
    <select
      id={id || name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      style={{
        width: '100%',
        padding: '12px 16px',
        background: 'var(--color-base-900)',
        border: `1px solid ${error ? '#ef4444' : 'var(--color-base-800)'}`,
        borderRadius: '12px',
        color: 'var(--color-base-100)',
        fontSize: '14px',
        fontFamily: 'inherit',
        outline: 'none',
        cursor: 'pointer',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
        transition: 'background 0.2s, box-shadow 0.2s',
        appearance: 'none', // clean up default dropdown arrow styling usually
      }}
      onFocus={(e) => {
        e.target.style.background = 'var(--color-base-950)';
        e.target.style.borderColor = 'var(--color-accent-500)';
        e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2), 0 0 0 3px rgba(99,102,241,0.2)';
      }}
      onBlur={(e) => {
        e.target.style.background = 'var(--color-base-900)';
        e.target.style.borderColor = 'var(--color-base-800)';
        e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
      }}
    >
      {children}
    </select>
    {error && (
      <motion.span
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ color: '#ef4444', fontSize: '12px', marginLeft: '4px' }}
      >
        {error}
      </motion.span>
    )}
  </div>
);

export default Input;
