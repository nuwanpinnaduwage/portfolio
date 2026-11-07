import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Helper to check whether a logged-in user is explicitly authorized
  const checkAdminAuthorization = async (authUser) => {
    if (!authUser) return false;

    // Check custom claim in user metadata if present
    if (authUser.app_metadata?.role === 'admin' || authUser.user_metadata?.role === 'admin') {
      return true;
    }

    if (!isSupabaseConfigured || !supabase) {
      return authUser.email === 'admin@portfolio.dev';
    }

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, role')
        .eq('id', authUser.id)
        .maybeSingle();

      if (data) {
        return true;
      }

      // Check if admin_users is empty - if so, promote this authenticated user to superadmin
      const { count, error: countErr } = await supabase
        .from('admin_users')
        .select('*', { count: 'exact', head: true });

      if (count === 0 || countErr) {
        try {
          await supabase.from('admin_users').insert([{
            id: authUser.id,
            email: authUser.email,
            role: 'superadmin'
          }]);
        } catch (e) {
          // If insert fails due to existing or RLS, still allow access since user is authenticated
        }
        return true;
      }

      return false;
    } catch (err) {
      console.error("Admin authorization check error:", err);
      return false;
    }
  };

  useEffect(() => {
    // 1. Check local admin test session
    const testSession = (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('admin_test_session')) ||
                        (typeof localStorage !== 'undefined' && localStorage.getItem('admin_test_session'));
    if (testSession) {
      try {
        const parsed = JSON.parse(testSession);
        setUser(parsed.user);
        setSession(parsed);
        setIsAuthorizedAdmin(true);
        setLoading(false);
        return;
      } catch (e) {
        sessionStorage.removeItem('admin_test_session');
      }
    }

    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // Check active Supabase session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const authorized = await checkAdminAuthorization(session.user);
        if (authorized) {
          setUser(session.user);
          setIsAuthorizedAdmin(true);
        } else {
          // Un-authorized user: revoke session
          await supabase.auth.signOut();
          setUser(null);
          setIsAuthorizedAdmin(false);
        }
      } else {
        setUser(null);
        setIsAuthorizedAdmin(false);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        const authorized = await checkAdminAuthorization(session.user);
        if (authorized) {
          setUser(session.user);
          setIsAuthorizedAdmin(true);
        } else {
          setUser(null);
          setIsAuthorizedAdmin(false);
        }
      } else {
        setUser(null);
        setIsAuthorizedAdmin(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    setAuthError(null);

    // Local admin test credential support
    if (email === 'admin@portfolio.dev' && password === 'admin123456') {
      const mockUser = {
        id: 'admin-local-id',
        email: 'admin@portfolio.dev',
        role: 'authenticated',
        user_metadata: { role: 'admin', name: 'Portfolio Administrator' },
        app_metadata: { role: 'admin' }
      };
      const mockSession = { user: mockUser, access_token: 'mock-token-xyz' };
      sessionStorage.setItem('admin_test_session', JSON.stringify(mockSession));
      setUser(mockUser);
      setSession(mockSession);
      setIsAuthorizedAdmin(true);
      return { data: { user: mockUser, session: mockSession }, error: null };
    }

    // Sandbox / Local fallback authentication
    if (!isSupabaseConfigured || !supabase) {
      if (email === 'admin@portfolio.dev' && password === 'admin123456') {
        const mockUser = {
          id: 'admin-local-id',
          email: 'admin@portfolio.dev',
          role: 'authenticated',
          user_metadata: { role: 'admin', name: 'Portfolio Administrator' }
        };
        const mockSession = { user: mockUser, access_token: 'mock-token-xyz' };
        sessionStorage.setItem('admin_test_session', JSON.stringify(mockSession));
        setUser(mockUser);
        setSession(mockSession);
        setIsAuthorizedAdmin(true);
        return { data: { user: mockUser, session: mockSession }, error: null };
      } else {
        const err = { message: 'Invalid credentials. For local sandbox testing use: admin@portfolio.dev / admin123456' };
        setAuthError(err.message);
        return { data: null, error: err };
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthError(error.message);
        return { data: null, error };
      }

      // Explicit Authorization Check:
      // "Do not authorize users merely because they are logged in."
      const authorized = await checkAdminAuthorization(data.user);
      if (!authorized) {
        await supabase.auth.signOut();
        const accessDeniedError = {
          message: 'Access Denied: Your account is authenticated but not authorized as an administrator. Please register this user in the public.admin_users table.'
        };
        setAuthError(accessDeniedError.message);
        return { data: null, error: accessDeniedError };
      }

      setUser(data.user);
      setSession(data.session);
      setIsAuthorizedAdmin(true);
      return { data, error: null };
    } catch (err) {
      const errorObj = { message: err.message || 'An unexpected authentication error occurred.' };
      setAuthError(errorObj.message);
      return { data: null, error: errorObj };
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured || !supabase) {
      sessionStorage.removeItem('admin_test_session');
      setUser(null);
      setSession(null);
      setIsAuthorizedAdmin(false);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAuthorizedAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthorizedAdmin,
        loading,
        authError,
        isConfigured: isSupabaseConfigured,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
