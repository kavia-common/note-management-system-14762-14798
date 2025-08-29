export interface User {
  id: string
  name: string
  email: string
  createdAt?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Note {
  id: string
  title: string
  content: string
  updatedAt: string
  createdAt: string
}

export interface NoteInput {
  title: string
  content: string
}

export interface NotesQuery {
  q?: string
}
