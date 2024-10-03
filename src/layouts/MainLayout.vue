<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">
        <q-toolbar-title class="text-h4 text-center">
          QUIZ
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">

defineOptions({
  name: 'MainLayout'
})
</script>
