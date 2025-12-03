<script setup lang="ts">
import config from '@/config';
import { useAuthStore } from '@/stores';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  authStore.clearUser();

  if (authStore.authWith === 'google') {
    window.location.href = `${config.api_url}/api/auth/logout`;
  } else {
    router.push('/login');
  }
});
</script>
<template>
  <div></div>
</template>
