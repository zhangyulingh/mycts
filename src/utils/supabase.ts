import {createClient, type SupabaseClient} from "@supabase/supabase-js"

const SUPABASE_URL = "https://cdvcpwcycwmjmepxzcmr.supabase.co"
const SUPABASE_KEY = "sb_publishable_-BJe1Q08nE5bH210b9UxMA_gvzd1SZB"

export const isSupabaseConfigured = true

function clearStaleSupabaseAuth(url: string) {
  try {
    const projectRef = new URL(url).hostname.split(".")[0]
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key?.startsWith(`sb-${projectRef}-`)) {
        localStorage.removeItem(key)
      }
    }
  } catch {
    // ignore
  }
}

function createSupabaseClient(): SupabaseClient {
  clearStaleSupabaseAuth(SUPABASE_URL)

  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    accessToken: async () => SUPABASE_KEY,
  })
}

export const supabase: SupabaseClient = createSupabaseClient()

export function getSupabase() {
  return supabase
}
