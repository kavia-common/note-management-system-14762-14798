<template>
  <div class="nf container">
    <div class="content card">
      <h2>Page not found</h2>
      <p>The page you are looking for does not exist.</p>
      <router-link class="btn" to="/">Go home</router-link>
    </div>
  </div>
</template>

<style scoped>
.nf {
  min-height: calc(100vh - 80px);
  display: grid;
  place-items: center;
}
.content {
  padding: 24px;
  text-align: center;
}
.content h2 {
  color: var(--text-0);
  margin-bottom: 8px;
}
.content p {
  color: var(--text-muted);
  margin-bottom: 12px;
}
</style>
