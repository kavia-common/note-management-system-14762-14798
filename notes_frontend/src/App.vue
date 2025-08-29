<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from './stores/auth'
import AppSidebar from './components/layout/AppSidebar.vue'
import AppTopbar from './components/layout/AppTopbar.vue'

const auth = useAuthStore()
const router = useRouter()

const isAuthed = computed(() => auth.isAuthenticated)
const appName = (import.meta.env.VITE_APP_NAME || 'Notes') as string

// PUBLIC_INTERFACE
function handleLogout() {
  /** Triggers logout and redirects to login. */
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="app-shell">
    <AppTopbar
      :appName="appName"
      :user="auth.user"
      :isAuthed="isAuthed"
      @logout="handleLogout"
    />

    <div class="app-body">
      <AppSidebar v-if="isAuthed" />

      <main class="app-main">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--surface-1);
}

.app-body {
  display: grid;
  grid-template-columns: var(--sidebar-w) 1fr;
  gap: 16px;
  padding: 16px;
}

.app-main {
  min-height: calc(100vh - 80px);
}

@media (max-width: 900px) {
  .app-body {
    grid-template-columns: 1fr;
  }
}
</style>
