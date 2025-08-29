<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

defineProps<{
  appName: string
  user: { name?: string | null } | null
  isAuthed: boolean
}>()

const emit = defineEmits<{ logout: [] }>()
</script>

<template>
  <header class="topbar card">
    <div class="left">
      <div class="logo">
        <div class="dot" />
      </div>
      <div class="name">{{ appName }}</div>
    </div>
    <div class="right">
      <template v-if="isAuthed">
        <span class="user">{{ user?.name || 'User' }}</span>
        <button class="btn ghost" @click="emit('logout')">Logout</button>
      </template>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: saturate(1.2) blur(6px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  margin: 0;
  border-radius: 0;
  border-left: none;
  border-right: none;
}

.left {
  display: flex;
  gap: 10px;
  align-items: center;
}
.logo {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  display: grid;
  place-items: center;
  box-shadow: 0 6px 20px rgba(59,130,246,.25);
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 99px;
  background: white;
  opacity: 0.95;
}
.name {
  color: var(--text-0);
  font-weight: 600;
  letter-spacing: 0.2px;
}

.right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user {
  color: var(--text-muted);
  font-size: 14px;
}
</style>
