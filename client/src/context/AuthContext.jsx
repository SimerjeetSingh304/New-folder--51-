import { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return { ...initialState, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On mount — validate stored token
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('devtracker_token');
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        const res = await authService.getMe();
        dispatch({
          type: 'LOGIN',
          payload: { user: res.data.user, token },
        });
      } catch {
        localStorage.removeItem('devtracker_token');
        localStorage.removeItem('devtracker_user');
        dispatch({ type: 'LOGOUT' });
      }
    };

    validateToken();
  }, []);

  const login = (token, user) => {
    localStorage.setItem('devtracker_token', token);
    localStorage.setItem('devtracker_user', JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: { token, user } });
  };

  const logout = () => {
    localStorage.removeItem('devtracker_token');
    localStorage.removeItem('devtracker_user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
