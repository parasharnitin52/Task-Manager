import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from '../api/client.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'team-task-manager-auth';

const getStoredAuth = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { user: null, token: null };

    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') return { user: null, token: null };

    return {
      user: parsed.user ?? null,
      token: parsed.token ?? null
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return { user: null, token: null };
  }
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getStoredAuth);

  useEffect(() => {
    setAuthToken(auth.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));

    if (auth.token && !auth.user?.permissions) {
      api.get('/auth/me')
        .then(({ data }) => {
          setAuth((current) => ({ ...current, user: data.user }));
        })
        .catch(() => {
          /* if me fails, token might be invalid */
          setAuth({ user: null, token: null });
        });
    }
  }, [auth.token]); // Only trigger when token changes or on initial mount if token exists

  const value = useMemo(() => ({
    user: auth.user,
    token: auth.token,
    isAdmin: auth.user?.role === 'ADMIN',
    async login(payload) {
      const { data } = await api.post('/auth/login', payload);
      setAuth({ user: data.user, token: data.token });
    },
    async signup(payload) {
      const { data } = await api.post('/auth/signup', payload);
      setAuth({ user: data.user, token: data.token });
    },
    logout() {
      setAuth({ user: null, token: null });
    },
    updateUser(user) {
      setAuth((current) => ({ ...current, user }));
    }
  }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
