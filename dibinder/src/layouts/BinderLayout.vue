<script setup lang="ts">
import SideBar from '@/components/SideBar.vue';
import { useAuthStore } from '@/stores';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();
const userName = authStore.userName;
</script>

<template>
  <div class="w-full h-screen bg-primary text-dark">
    <div class="flex flex-row">
      <SideBar
        :username="userName as string"
        :route-name="route?.name as string"
      />

      <router-view />
    </div>
  </div>
</template>
