import { createContext, useContext, useReducer, useCallback } from 'react';

const ToastContext = createContext(null);

const toastReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'REMOVE':
      return state.filter((t) => t.id !== action.payload);
    default:
      return state;
  }
};

export const ToastProvider = ({ children }) => {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    dispatch({ type: 'ADD', payload: { id, message, type } });
    setTimeout(() => dispatch({ type: 'REMOVE', payload: id }), 3000);
  }, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: 'REMOVE', payload: id });
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '360px',
        }}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onRemove }) => {
  const colors = {
    success: { bg: '#064e3b', border: '#10b981', icon: '✓' },
    error: { bg: '#450a0a', border: '#ef4444', icon: '✕' },
    info: { bg: '#1e1b4b', border: '#7c3aed', icon: 'ℹ' },
  };

  const style = colors[toast.type] || colors.info;

  return (
    <div
      className="animate-slideInRight"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: '10px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        cursor: 'pointer',
      }}
      onClick={() => onRemove(toast.id)}
    >
      <span
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: style.border,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: '700',
          color: '#fff',
          flexShrink: 0,
        }}
      >
        {style.icon}
      </span>
      <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500' }}>
        {toast.message}
      </span>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
