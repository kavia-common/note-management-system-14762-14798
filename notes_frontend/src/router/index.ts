import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { public: true, title: 'Login' },
  },
  {
    path: '/',
    component: () => import('@/views/NotesLayout.vue'),
    children: [
      { path: '', name: 'notes', component: () => import('@/views/NotesListView.vue') },
      { path: 'new', name: 'note-new', component: () => import('@/views/NoteEditorView.vue') },
      { path: ':id', name: 'note-view', component: () => import('@/views/NoteEditorView.vue') },
    ],
    meta: { requiresAuth: true, title: 'Notes' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { public: true, title: 'Not Found' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.public && auth.isAuthenticated && to.name === 'login') {
    return { name: 'notes' }
  }
  return true
})

router.afterEach((to) => {
  const appName = import.meta.env.VITE_APP_NAME || 'Notes'
  document.title = to.meta?.title ? `${to.meta.title} • ${appName}` : appName
})

export default router
