<script setup lang="ts">
import { useAuthStore } from '@/stores';
import { useToast } from 'primevue';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { jwtDecode } from 'jwt-decode';
import type { DecodedToken } from '@/types';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

onMounted(() => {
  const token = route.query?.token as string | null;

  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);

      authStore.setUser(
        decoded?.id,
        token,
        decoded?.name,
        decoded?.photoUrl || '',
        'google',
      );

      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Sign in successful!',
        life: 3000,
      });

      router.push('/dashboard');
    } catch (e) {
      console.error('Invalid token:', e);
      toast.add({
        severity: 'error',
        summary: 'Authentication Failed',
        detail: 'Invalid authentication token. Please try again.',
        life: 3000,
      });
      router.push('/login');
    }
  } else {
    toast.add({
      severity: 'error',
      summary: 'Authentication Failed',
      detail: 'Authentication token not found. Please try again.',
      life: 3000,
    });
    router.push('/login');
  }
});
</script>
<template>
  <div class="flex item-center justify-center h-screen">
    <div class="text-center">
      <p>Authenticating, please wait...</p>
    </div>
  </div>
</template>
