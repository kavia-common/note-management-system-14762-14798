<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { Note, NoteInput } from '@/types'

const props = defineProps<{
  note?: Note | null
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [payload: NoteInput]
  delete: []
}>()

const state = reactive<NoteInput>({
  title: '',
  content: '',
})

watch(
  () => props.note,
  (n) => {
    state.title = n?.title || ''
    state.content = n?.content || ''
  },
  { immediate: true }
)

const canSave = computed(() => (state.title || state.content) && !props.loading)

function onSave() {
  emit('save', { title: state.title.trim(), content: state.content.trim() })
}
</script>

<template>
  <div class="editor card">
    <div class="header">
      <input
        v-model="state.title"
        class="input title"
        placeholder="Note title"
        aria-label="Note title"
      />
      <div class="actions">
        <button class="btn ghost" v-if="note?.id" @click="$emit('delete')" :disabled="loading">
          Delete
        </button>
        <button class="btn" @click="onSave" :disabled="!canSave">Save</button>
      </div>
    </div>

    <textarea
      v-model="state.content"
      class="textarea content"
      placeholder="Start writing your note here..."
      aria-label="Note content"
    />
  </div>
</template>

<style scoped>
.editor {
  padding: 14px;
}

.header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 8px;
}

.content {
  min-height: calc(100vh - 220px);
  line-height: 1.6;
}

@media (max-width: 900px) {
  .content {
    min-height: 320px;
  }
}
</style>
