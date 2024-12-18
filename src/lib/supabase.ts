import { createClient } from '@supabase/supabase-js'
import { config } from './config'
import { toast } from './toast'

// Validate Supabase configuration
function validateSupabaseConfig() {
  if (!config.supabase.url || !config.supabase.anonKey) {
    const error = new Error('Invalid Supabase configuration');
    console.error('Missing Supabase configuration:', error);
    toast({
      title: 'Configuration Error',
      description: 'Invalid Supabase configuration. Please check your environment variables.',
      variant: 'destructive'
    });
    throw error;
  }
}

// Validate configuration before creating client
validateSupabaseConfig();

interface SessionMetric {
  id: string
  conversation_id: string | null
  user_id: string | null
  session_start: string | null
  session_end: string | null
  total_messages: number | null
  successful_actions: number | null
  session_duration_seconds: number | null
  created_at: string | null
}

export type Database = {
  public: {
    Tables: {
      chats: {
        Row: ChatRecord
        Insert: Omit<ChatRecord, 'id' | 'created_at'>
        Update: Partial<Omit<ChatRecord, 'id' | 'created_at'>>
      },
      session_metrics: {
        Row: SessionMetric
        Insert: Omit<SessionMetric, 'id' | 'created_at'>
        Update: Partial<Omit<SessionMetric, 'id' | 'created_at'>>
      }
    }
  }
  auth: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          raw_user_meta_data: {
            first_name: string | null
          }
        }
      }
    }
  }
}

const REFRESH_MARGIN_MINUTES = 5;

export interface ChatRecord {
  id: bigint
  user_id: string
  message: string | Message[]
  created_at?: string
  conversation_id: string | null
  message_type?: string
  action_type?: string
  completion_status?: boolean
  feedback_score?: number
}

export const MAX_RETRIES = 3;
export const RETRY_DELAY = 1000; // 1 second

const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  if (error.message?.includes('Failed to fetch')) {
    toast({
      title: 'Connection error',
      description: 'Unable to connect to the server. Please check your internet connection.',
      variant: 'destructive'
    });
  }
  throw error;
};

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function saveWithRetry(
  operation: () => Promise<any>,
  retries = MAX_RETRIES
): Promise<any> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      await delay(RETRY_DELAY);
      return saveWithRetry(operation, retries - 1);
    }
    throw error;
  }
}
export const supabase = createClient<Database>(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: window?.localStorage
    },
    global: {
      fetch: (...args) => {
        return fetch(...args).catch(handleSupabaseError);
      }
    }
  }
);

export const refreshSessionIfNeeded = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return null;

  const expiresAt = session.expires_at;
  const now = Math.floor(Date.now() / 1000);
  const minutesUntilExpiry = (expiresAt - now) / 60;

  if (minutesUntilExpiry <= REFRESH_MARGIN_MINUTES) {
    const { data: { session: newSession }, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Error refreshing session:', error);
      return null;
    }
    return newSession;
  }

  return session;
};