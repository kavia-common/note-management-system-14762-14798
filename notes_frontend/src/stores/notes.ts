import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Note, NoteInput } from '@/types'
import { api } from '@/services/api'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const search = ref<string>('')

  const filtered = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return notes.value
    return notes.value.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    )
  })

  // PUBLIC_INTERFACE
  async function fetchNotes(q?: string) {
    /** Load notes from backend (optionally with search query). */
    try {
      loading.value = true
      error.value = null
      const list = await api.listNotes({ q })
      // sort by updatedAt desc
      notes.value = list.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load notes'
      error.value = msg
      throw e
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  async function getNoteById(id: string): Promise<Note> {
    /** Ensure a single note is up-to-date from backend. */
    const existing = notes.value.find((n) => n.id === id)
    if (existing) return existing
    const n = await api.getNote(id)
    const found = notes.value.findIndex((x) => x.id === n.id)
    if (found >= 0) notes.value.splice(found, 1, n)
    else notes.value.unshift(n)
    return n
  }

  // PUBLIC_INTERFACE
  async function create(input: NoteInput): Promise<Note> {
    /** Create a note and push it to the top of the list. */
    const n = await api.createNote(input)
    notes.value.unshift(n)
    return n
  }

  // PUBLIC_INTERFACE
  async function update(id: string, input: NoteInput): Promise<Note> {
    /** Update a note and sync in list. */
    const n = await api.updateNote(id, input)
    const idx = notes.value.findIndex((x) => x.id === id)
    if (idx >= 0) notes.value.splice(idx, 1, n)
    else notes.value.unshift(n)
    return n
  }

  // PUBLIC_INTERFACE
  async function remove(id: string): Promise<void> {
    /** Delete a note and remove from list. */
    await api.deleteNote(id)
    notes.value = notes.value.filter((n) => n.id !== id)
  }

  return { notes, loading, error, search, filtered, fetchNotes, getNoteById, create, update, remove }
})
