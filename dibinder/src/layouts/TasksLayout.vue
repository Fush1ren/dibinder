<script setup lang="ts">
import TaskDetail from '@/components/TaskDetail.vue';
import { useSideBarStore, useTaskDetailStore } from '@/stores';
import getElementStyle from '@/utils/styling';

const sidebarStore = useSideBarStore();
const taskDetailStore = useTaskDetailStore();
</script>
<template>
  <div
    :class="
      getElementStyle(sidebarStore.isOpen, taskDetailStore.isOpen).taskLayout
    "
  >
    <router-view />
  </div>
  <TaskDetail />
</template>
