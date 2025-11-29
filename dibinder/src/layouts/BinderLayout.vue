<script setup lang="ts">
import SideBar from '@/components/SideBar.vue';
import { useAuthStore } from '@/stores';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();
const userName = authStore.userName;
const isOpen = ref<boolean>();

const sideBarToggle = (con: boolean): void => {
  isOpen.value = con;
};
</script>

<template>
  <div class="w-full h-screen bg-primary text-dark">
    <div class="flex flex-row">
      <SideBar
        :username="userName as string"
        :route-name="route?.name as string"
        @open="sideBarToggle"
      />

      <router-view />
    </div>
  </div>
</template>
