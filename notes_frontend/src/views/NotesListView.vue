<script setup lang="ts">
import { useNotesStore } from '@/stores/notes'
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const notes = useNotesStore()

onMounted(() => {
  if (!notes.notes.length) {
    notes.fetchNotes()
  }
})
</script>

<template>
  <div class="list-view card">
    <div class="hero">
      <h2>Welcome to your Notes</h2>
      <p>Choose a note from the left, or create a new one to get started.</p>
      <RouterLink class="btn accent" :to="{ name: 'note-new' }">Create a note</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.list-view {
  min-height: calc(100vh - 80px);
  display: grid;
  place-items: center;
}
.hero {
  text-align: center;
  padding: 40px 16px;
}
.hero h2 {
  color: var(--text-0);
  font-size: 28px;
  margin-bottom: 8px;
}
.hero p {
  color: var(--text-muted);
  margin-bottom: 16px;
}
</style>
