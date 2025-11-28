<script setup lang="ts">
import { useAuthStore } from '@/stores';

const authStore = useAuthStore();
const userName = authStore.userName;
</script>

<template>
  <div class="w-full h-screen bg-primary text-dark">
    {{ userName }}
  </div>
</template>
