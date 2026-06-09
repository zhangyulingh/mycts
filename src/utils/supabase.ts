import {createClient, type SupabaseClient} from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
) as string | undefined

export const isSupabaseConfigured = Boolean(supabaseUrl?.trim() && supabaseAnonKey?.trim())

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

function createSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null

  const url = supabaseUrl!.trim()
  const key = supabaseAnonKey!.trim()

  clearStaleSupabaseAuth(url)

  // 固定使用 anon 密钥，避免残留用户会话 JWT 导致 Authorization 失效 → 401
  return createClient(url, key, {
    accessToken: async () => key,
  })
}

export const supabase: SupabaseClient | null = createSupabaseClient()

export function getSupabase() {
  if (!supabase) {
    throw new Error(
      "Supabase 未配置，请在 .env.local 设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY，并重启开发服务"
    )
  }
  return supabase
}
