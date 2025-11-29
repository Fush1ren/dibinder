<script setup lang="ts">
import TaskDetail from '@/components/TaskDetail.vue';
import { useSideBarStore } from '@/stores';
import getElementStyle from '@/utils/styling';

const sidebarStore = useSideBarStore();
</script>
<template>
  <div :class="getElementStyle(sidebarStore.isOpen).taskLayout">
    <router-view />
  </div>
  <TaskDetail />
</template>
