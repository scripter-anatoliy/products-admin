export const sessionStorage = {
  get<T>(key: string): T | null {
    try {
      const raw = window.sessionStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : null
    } catch {
      return null
    }
  },
  set(key: string, value: unknown): void {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore
    }
  },
  remove(key: string): void {
    window.sessionStorage.removeItem(key)
  },
}

export const localStorage = {
  get<T>(key: string): T | null {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : null
    } catch {
      return null
    }
  },
  set(key: string, value: unknown): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore
    }
  },
  remove(key: string): void {
    window.localStorage.removeItem(key)
  },
}
