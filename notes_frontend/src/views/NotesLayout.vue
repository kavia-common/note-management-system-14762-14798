<script setup lang="ts">
/* This view allows nested child routes for list/new/edit within the main area. */
</script>

<template>
  <section class="notes-layout">
    <router-view />
  </section>
</template>

<style scoped>
.notes-layout {
  width: 100%;
}
</style>
