interface Config {
  supabase: {
    url: string
    anonKey: string
  }
  openai: {
    apiKey: string
  }
}

const getValidConfig = (): Config => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!supabaseUrl) {
    throw new Error('Supabase URL configuration is missing')
  }

  return {
    supabase: {
      url: supabaseUrl,
      anonKey: supabaseAnonKey
    },
    openai: {
      apiKey: openaiApiKey || ''
    }
  }
}

export const config = getValidConfig()