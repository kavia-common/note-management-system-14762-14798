import type { Note, NoteInput, User, AuthResponse, NotesQuery } from '@/types'

// PUBLIC_INTERFACE
export class ApiClient {
  /** HTTP client for the notes backend. Base URL is sourced from VITE_API_BASE_URL. */
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl?: string) {
    this.baseUrl = (baseUrl || import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
  }

  setToken(token: string | null) {
    this.token = token
  }

  private headers(json = true): HeadersInit {
    const h: Record<string, string> = {}
    if (json) h['Content-Type'] = 'application/json'
    if (this.token) h['Authorization'] = `Bearer ${this.token}`
    return h
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const res = await fetch(url, { ...options })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(text || `Request failed with status ${res.status}`)
    }
    const isJson = res.headers.get('content-type')?.includes('application/json')
    if (isJson) {
      return (await res.json()) as T
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return undefined as any as T
  }

  // PUBLIC_INTERFACE
  async login(email: string, password: string): Promise<AuthResponse> {
    /** Login against backend, returns token and user. */
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ email, password }),
    })
  }

  // PUBLIC_INTERFACE
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    /** Register a new user, returns token and user. */
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ name, email, password }),
    })
  }

  // PUBLIC_INTERFACE
  async me(): Promise<User> {
    /** Returns current user profile. */
    return this.request<User>('/auth/me', {
      method: 'GET',
      headers: this.headers(false),
    })
  }

  // PUBLIC_INTERFACE
  async listNotes(query: NotesQuery = {}): Promise<Note[]> {
    /** Get notes optionally filtered by search q. */
    const params = new URLSearchParams()
    if (query.q) params.set('q', query.q)
    return this.request<Note[]>(`/notes?${params.toString()}`, {
      method: 'GET',
      headers: this.headers(false),
    })
  }

  // PUBLIC_INTERFACE
  async getNote(id: string): Promise<Note> {
    /** Fetch a single note by id. */
    return this.request<Note>(`/notes/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: this.headers(false),
    })
  }

  // PUBLIC_INTERFACE
  async createNote(input: NoteInput): Promise<Note> {
    /** Create a new note. */
    return this.request<Note>('/notes', {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(input),
    })
  }

  // PUBLIC_INTERFACE
  async updateNote(id: string, input: NoteInput): Promise<Note> {
    /** Update an existing note. */
    return this.request<Note>(`/notes/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(input),
    })
  }

  // PUBLIC_INTERFACE
  async deleteNote(id: string): Promise<void> {
    /** Delete a note. */
    await this.request<void>(`/notes/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: this.headers(false),
    })
  }
}

export const api = new ApiClient()
