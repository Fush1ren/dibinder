<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Toast from 'primevue/toast';
import NavBar from './components/NavBar.vue';
import type { RouteMeta } from './types';

const r = useRoute();

const meta = computed((): RouteMeta => {
  return r?.meta;
});
</script>

<template>
  <NavBar v-if="meta?.useNavbar" />
  <router-view />
  <Toast />
</template>
