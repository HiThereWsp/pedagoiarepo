import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, refreshSessionIfNeeded } from '../../lib/supabase';
import { config } from '../../lib/config';

interface UserMetadata {
  has_logged_in?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAndUpdateFirstLogin = async (userId: string) => {
    try {
      const { data: metadata } = await supabase
        .from('user_metadata')
        .select('has_logged_in')
        .eq('user_id', userId);

      if (!metadata?.has_logged_in) {
        // Update the metadata
        await supabase
          .from('user_metadata')
          .upsert({ 
            user_id: userId,
            has_logged_in: true 
          });
      }
    } catch (err) {
      console.error('Error checking first login:', err);
    }
  };

  useEffect(() => {
    if (!config.supabase.url || !config.supabase.anonKey) {
      setError('Authentication is not configured');
      setLoading(false);
      return;
    }

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAndUpdateFirstLogin(session.user.id);
      }
    });

    let refreshInterval: NodeJS.Timeout;

    const setupAuth = async () => {
      try {
        // Initial session check and refresh if needed
        const session = await refreshSessionIfNeeded();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          checkAndUpdateFirstLogin(session.user.id);
        }

        // Setup session refresh interval
        refreshInterval = setInterval(async () => {
          await refreshSessionIfNeeded();
        }, 4 * 60 * 1000); // Check every 4 minutes

        setLoading(false);
      } catch (err) {
        console.error('Auth setup error:', err);
        setError('Failed to initialize authentication');
        setLoading(false);
      }
    };

    setupAuth();

    // Cleanup
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!config.supabase.url || !config.supabase.anonKey) {
      throw new Error('La configuration de l\'authentification est manquante');
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes('Invalid login credentials') || error.message.includes('Email not confirmed')) {
          throw new Error('Votre adresse mail ou mot de passe ne correspond à aucun compte. Veuillez créer un compte');
        }
        throw error;
      }
      
      // Refresh the session immediately after sign in
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur est survenue lors de la connexion.');
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!config.supabase.url || !config.supabase.anonKey) {
      throw new Error('La configuration de l\'authentification est manquante');
    }
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: null
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          throw new Error('Vous avez déjà un compte. Cliquez sur "Mot de passe oublié" pour retrouver vos accès.');
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      if (error instanceof Error) throw error;
      throw new Error('Échec de l\'inscription.');
    }
  };

  const resetPassword = async (email: string) => {
    if (!config.supabase.url || !config.supabase.anonKey) {
      throw new Error('La configuration de l\'authentification est manquante');
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error('Échec de l\'envoi du lien de réinitialisation.');
    }
  };

  const signOut = async () => {
    if (!config.supabase.url || !config.supabase.anonKey) {
      throw new Error('La configuration de l\'authentification est manquante');
    }
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Échec de la déconnexion. Veuillez réessayer.');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}