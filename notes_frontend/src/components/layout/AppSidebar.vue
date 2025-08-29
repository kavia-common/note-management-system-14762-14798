<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useNotesStore } from '@/stores/notes'
import { useRoute, useRouter } from 'vue-router'

const notesStore = useNotesStore()
const route = useRoute()
const router = useRouter()

onMounted(() => {
  notesStore.fetchNotes()
})

watch(
  () => notesStore.search,
  () => {
    // Live search in-memory; optionally could trigger API search
  },
  { deep: true }
)

function openNote(id: string) {
  router.push({ name: 'note-view', params: { id } })
}
</script>

<template>
  <aside class="sidebar card">
    <div class="sidebar-header">
      <input
        v-model="notesStore.search"
        class="input"
        type="search"
        placeholder="Search notes..."
        aria-label="Search notes"
      />
      <router-link class="btn accent" :to="{ name: 'note-new' }">New</router-link>
    </div>

    <div class="hr" />

    <div class="list" v-if="!notesStore.loading">
      <button
        v-for="n in notesStore.filtered"
        :key="n.id"
        class="note-item"
        :class="{ active: route.params.id === n.id }"
        @click="openNote(n.id)"
        :title="n.title"
      >
        <div class="title">{{ n.title || 'Untitled' }}</div>
        <div class="meta">
          <span class="badge">{{ new Date(n.updatedAt).toLocaleString() }}</span>
        </div>
      </button>

      <div v-if="notesStore.filtered.length === 0" class="empty">
        No notes found
      </div>
    </div>

    <div class="list" v-else>
      <div class="skeleton" />
      <div class="skeleton" />
      <div class="skeleton" />
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  height: calc(100vh - 80px);
  position: sticky;
  top: 80px;
  padding: 12px;
}

.sidebar-header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 0;
  overflow: auto;
  max-height: calc(100vh - 140px);
}

.note-item {
  text-align: left;
  border: 1px solid var(--border);
  background: var(--surface-0);
  color: var(--text-1);
  border-radius: 10px;
  padding: 10px 12px;
  transition: transform var(--transition), box-shadow var(--transition), background var(--transition), border-color var(--transition);
  cursor: pointer;
}
.note-item:hover {
  border-color: var(--color-primary);
  background: #f8fbff;
  box-shadow: 0 6px 16px rgba(59,130,246,0.08);
  transform: translateY(-1px);
}
.note-item.active {
  border-color: var(--color-primary);
  box-shadow: inset 0 0 0 2px rgba(59,130,246,0.15);
}

.title {
  font-weight: 600;
  color: var(--text-0);
}
.meta {
  margin-top: 6px;
}

.empty {
  color: var(--text-muted);
  text-align: center;
  padding: 24px 8px;
}

.skeleton {
  height: 54px;
  border-radius: 10px;
  background: linear-gradient(90deg, #f3f4f6 25%, #f9fafb 37%, #f3f4f6 63%);
  background-size: 400% 100%;
  animation: shine 1.5s infinite;
  border: 1px solid var(--border);
}
@keyframes shine {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

@media (max-width: 900px) {
  .sidebar {
    height: auto;
    position: static;
  }
}
</style>
