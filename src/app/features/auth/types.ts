export interface LoginPayload {
  email: string
  password: string
}

export interface AuthUser {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
}

export interface AuthTokenContent {
  accessToken: string
  user: AuthUser
}

export interface LoginResponse {
  accessToken: string
  user: AuthUser
}
