<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notes'
import NoteEditor from '@/components/notes/NoteEditor.vue'
import type { Note } from '@/types'

const route = useRoute()
const router = useRouter()
const notes = useNotesStore()

const current = ref<Note | null>(null)
const saving = ref(false)

async function load() {
  const id = route.params.id as string | undefined
  if (!id) {
    current.value = null
    return
  }
  current.value = await notes.getNoteById(id)
}

onMounted(() => {
  load()
})

async function onSave(payload: { title: string; content: string }) {
  try {
    saving.value = true
    if (current.value?.id) {
      const updated = await notes.update(current.value.id, payload)
      current.value = updated
    } else {
      const created = await notes.create(payload)
      current.value = created
      router.replace({ name: 'note-view', params: { id: created.id } })
    }
  } finally {
    saving.value = false
  }
}

async function onDelete() {
  if (!current.value?.id) return
  if (!confirm('Delete this note?')) return
  await notes.remove(current.value.id)
  router.replace({ name: 'notes' })
}
</script>

<template>
  <NoteEditor :note="current" :loading="saving" @save="onSave" @delete="onDelete" />
</template>
