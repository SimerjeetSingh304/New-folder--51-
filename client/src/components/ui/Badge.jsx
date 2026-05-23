import { JOB_STATUS_COLORS, DIFFICULTY_COLORS, APTITUDE_STATUS_COLORS } from '../../utils/constants';

const Badge = ({ label, type = 'job-status' }) => {
  let colors;

  if (type === 'job-status') colors = JOB_STATUS_COLORS[label];
  else if (type === 'difficulty') colors = DIFFICULTY_COLORS[label];
  else if (type === 'dsa-status' || type === 'aptitude-status') colors = APTITUDE_STATUS_COLORS[label];
  else colors = { bg: 'rgba(39, 39, 42, 0.5)', text: '#a1a1aa', border: '#3f3f46' };

  if (!colors) colors = { bg: 'rgba(39, 39, 42, 0.5)', text: '#a1a1aa', border: '#3f3f46' };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        whiteSpace: 'nowrap',
        letterSpacing: '0.02em',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: colors.text,
          boxShadow: `0 0 6px ${colors.text}`,
        }}
      />
      {label}
    </span>
  );
};

export default Badge;
