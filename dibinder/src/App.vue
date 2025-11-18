<script setup lang="ts">
import { useRoute } from 'vue-router';
import NavBar from './components/NavBar.vue';
import { computed } from 'vue';

const r = useRoute();

const route = computed((): string => {
  return r?.path;
});
</script>

<template>
  <NavBar v-if="route !== '/login' && route !== '/sign-up'" />
  <router-view />
</template>
