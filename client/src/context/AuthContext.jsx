import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { apiFetch } from "../lib/api";

const AuthContext = createContext(null);
const hasSupabaseConfig = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

const getRedirectUrl = () => {
  return (
    import.meta.env.VITE_SUPABASE_REDIRECT_URL ||
    `${window.location.origin}/auth/callback`
  );
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setAuthLoading(false);
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;
      if (error) {
        setAuthError(error.message);
      }
      setSession(data?.session ?? null);
      setAuthLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setAuthError("");
    });

    return () => {
      isMounted = false;
      if (subscription?.subscription?.unsubscribe) {
        subscription.subscription.unsubscribe();
      } else if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.access_token) {
        setProfile(null);
        return;
      }

      setProfileLoading(true);
      try {
        const data = await apiFetch("/api/auth/me", {
          token: session.access_token
        });
        setProfile(data?.user ?? null);
      } catch (error) {
        setAuthError(error.message || "Unable to load profile.");
        setProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [session?.access_token]);

  const signIn = async ({ email, password }) => {
    if (!hasSupabaseConfig) {
      throw new Error("Supabase is not configured.");
    }

    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const signUp = async ({ email, password, fullName }) => {
    if (!hasSupabaseConfig) {
      throw new Error("Supabase is not configured.");
    }

    setAuthError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    if (!hasSupabaseConfig) {
      throw new Error("Supabase is not configured.");
    }

    setAuthError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getRedirectUrl()
      }
    });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    if (!hasSupabaseConfig) return;
    await supabase.auth.signOut();
    setProfile(null);
  };

  const updateProfile = async (profileUpdates) => {
    if (!session?.access_token) {
      throw new Error("Not authenticated.");
    }

    const data = await apiFetch("/api/auth/me", {
      method: "PATCH",
      token: session.access_token,
      body: JSON.stringify(profileUpdates)
    });

    setProfile(data?.user ?? null);
    return data;
  };

  const value = useMemo(
    () => ({
      session,
      token: session?.access_token ?? null,
      user: session?.user ?? null,
      profile,
      authLoading,
      profileLoading,
      authError,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      updateProfile
    }),
    [session, profile, authLoading, profileLoading, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
