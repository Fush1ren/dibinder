<script setup lang="ts">
import { useAuthStore } from '@/stores';

const authStore = useAuthStore();
const userName = authStore.userName;
</script>

<template>
  <div>
    {{ userName }}
  </div>
</template>
