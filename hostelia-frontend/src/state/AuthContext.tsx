import { createContext, useContext, useEffect, useState } from 'react';
import api, { setAuthToken } from '../api/client';

type AuthUser = { id: string; email: string } | null;

type SigninInput = { email: string; password: string };
type SignupInput = SigninInput & {
  name?: string;
  hostelName: string;
  hostelAddress: string;
};

type AuthContextValue = {
  user: AuthUser;
  token: string | null;
  signin: (input: SigninInput) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  signout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('hostelia:token');
    const savedUser = localStorage.getItem('hostelia:user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setAuthToken(savedToken);
    }
  }, []);

  const persist = (accessToken: string, payload: AuthUser) => {
    setToken(accessToken);
    setUser(payload);
    localStorage.setItem('hostelia:token', accessToken);
    localStorage.setItem('hostelia:user', JSON.stringify(payload));
    setAuthToken(accessToken);
  };

  const signin = async (input: SigninInput) => {
    const { data } = await api.post('/auth/signin', input);
    persist(data.accessToken, data.user);
  };

  const signup = async (input: SignupInput) => {
    const { data } = await api.post('/auth/signup', input);
    persist(data.accessToken, data.user);
  };

  const signout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('hostelia:token');
    localStorage.removeItem('hostelia:user');
    setAuthToken(undefined);
  };

  return <AuthContext.Provider value={{ user, token, signin, signup, signout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('AuthContext missing');
  }
  return ctx;
};
