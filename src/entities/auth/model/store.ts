import { create } from 'zustand'
import { sessionStorage, localStorage } from '@/shared/lib/storage'

const AUTH_KEY = 'auth-token'
const AUTH_PERSISTENT_KEY = 'auth-token-persistent'

function getStoredToken(): string | null {
  return sessionStorage.get<string>(AUTH_KEY) ?? localStorage.get<string>(AUTH_PERSISTENT_KEY)
}

function saveToken(token: string, rememberMe: boolean): void {
  if (rememberMe) {
    localStorage.set(AUTH_PERSISTENT_KEY, token)
    sessionStorage.remove(AUTH_KEY)
  } else {
    sessionStorage.set(AUTH_KEY, token)
    localStorage.remove(AUTH_PERSISTENT_KEY)
  }
}

function clearToken(): void {
  sessionStorage.remove(AUTH_KEY)
  localStorage.remove(AUTH_PERSISTENT_KEY)
}

type AuthState = {
  token: string | null
  setToken: (token: string | null, rememberMe?: boolean) => void
  logout: () => void
  getStoredToken: () => string | null
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: getStoredToken(),

  setToken: (token, rememberMe = false) => {
    if (token) saveToken(token, rememberMe)
    else clearToken()
    set({ token })
  },

  logout: () => {
    clearToken()
    set({ token: null })
  },

  getStoredToken,
}))

export function hydrateAuth(): void {
  const token = getStoredToken()
  if (token) useAuthStore.setState({ token })
}
