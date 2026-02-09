import { post, ApiError } from '@/shared/api/base'

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  accessToken: string
  refreshToken: string
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  return post<LoginResponse>('/auth/login', {
    username: credentials.username,
    password: credentials.password,
    expiresInMins: 60,
  })
}

export { ApiError }
