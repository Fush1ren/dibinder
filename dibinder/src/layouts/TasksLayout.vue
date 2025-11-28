<script setup lang="ts">
import TaskDetail from '@/components/TaskDetail.vue';
</script>
<template>
  <div class="w-[45%] h-full">
    <router-view />
  </div>
  <TaskDetail />
</template>
