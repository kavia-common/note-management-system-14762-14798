<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const mode = ref<'login' | 'register'>('login')
const appName = (import.meta.env.VITE_APP_NAME || 'Notes') as string

const form = reactive({
  name: '',
  email: '',
  password: '',
})

async function submit() {
  try {
    if (mode.value === 'login') {
      await auth.login(form.email, form.password)
    } else {
      await auth.register(form.name, form.email, form.password)
    }
    const redirect = (route.query.redirect as string) || '/'
    router.replace(redirect)
  } catch {
    // error shown from store
  }
}
</script>

<template>
  <div class="login container">
    <div class="panel card">
      <div class="brand">
        <div class="mark" />
        <div class="title">
          <h1>{{ appName }}</h1>
          <p>Sign in to continue</p>
        </div>
      </div>

      <div class="switch">
        <button class="btn" :class="{ ghost: mode !== 'login' }" @click="mode = 'login'">Login</button>
        <button class="btn" :class="{ ghost: mode !== 'register' }" @click="mode = 'register'">Register</button>
      </div>

      <form class="form" @submit.prevent="submit">
        <div v-if="mode==='register'">
          <label>Name</label>
          <input v-model="form.name" class="input" placeholder="Your name" required />
        </div>
        <div>
          <label>Email</label>
          <input v-model="form.email" type="email" class="input" placeholder="you@example.com" required />
        </div>
        <div>
          <label>Password</label>
          <input v-model="form.password" type="password" class="input" placeholder="••••••••" required />
        </div>

        <button class="btn" type="submit" :disabled="auth.loading">
          {{ auth.loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Create account') }}
        </button>

        <p v-if="auth.error" class="error">{{ auth.error }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login {
  display: grid;
  place-items: center;
  min-height: calc(100vh - 80px);
}

.panel {
  width: 100%;
  max-width: 420px;
  padding: 18px;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 10px;
}
.mark {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-primary));
  box-shadow: 0 10px 30px rgba(34,211,238,.25);
}
.title h1 {
  margin-bottom: 2px;
  color: var(--text-0);
  font-size: 20px;
}
.title p {
  color: var(--text-muted);
  font-size: 13px;
}

.switch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: 8px 0 12px;
}

.form {
  display: grid;
  gap: 10px;
}
label {
  display: block;
  margin: 6px 0 6px;
  color: var(--text-muted);
  font-size: 13px;
}
.error {
  color: #b91c1c;
  background: #fee2e2;
  border: 1px solid #fecaca;
  padding: 10px 12px;
  border-radius: 10px;
}
</style>
