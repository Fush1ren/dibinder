<script setup lang="ts">
import { useTaskStore } from '@/stores';
import { onMounted, ref } from 'vue';
import type { TaskCalendar } from '@/types';
import Calendar from '@/components/Calendar.vue';

const taskStore = useTaskStore();
const tasks = ref<TaskCalendar[]>([]);

onMounted(async () => {
  try {
    await taskStore.getTaskCalendar();
    await taskStore.getTasks();
    tasks.value = taskStore.tasksCalendar;
    // tasks.value = (taskStore.tasks as TasksResponse[])?.map((data) => ({
    //   _id: data?._id,
    //   name: data?.name,
    //   startDate: data?.startDate as string,
    //   dueDate: data?.dueDate as string,
    //   color: data?.list?.color as string,
    // }));
  } catch (err) {
    console.error(err);
  }
});
</script>
<template>
  <div class="w-full h-screen">
    <div class="h-full p-4">
      <div class="overflow-y-auto">
        <Calendar :tasks="tasks" />
      </div>
    </div>
  </div>
</template>
