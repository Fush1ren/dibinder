<script setup lang="ts">
import TaskDetail from '@/components/TaskDetail.vue';
import { useSideBarStore, useTaskDetailStore } from '@/stores';
import getElementStyle from '@/utils/styling';
import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const sidebarStore = useSideBarStore();
const taskDetailStore = useTaskDetailStore();
const route = useRoute();
const router = useRouter();

watch(
  () => route.fullPath,
  () => {
    if (
      route.fullPath?.includes('/binder/tasks/today') ||
      route.fullPath?.includes('/binder/tasks/all-task') ||
      route.fullPath?.includes('/binder/tasks/calendar')
    ) {
      router.push(route.fullPath);
    } else {
      router.push('/binder/tasks/today');
    }
  },
  {
    immediate: true,
  },
);
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
