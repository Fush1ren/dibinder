<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ref, watch } from 'vue';

type Task = {
  _id: string;
  name: string;
  startDate: string | null;
  dueDate: string | null;
};

const props = defineProps<{
  tasks: Task[];
}>();

const calendarOptions = ref({
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  height: '100%',
  contentHeight: 'auto',
  displayEventTime: false,
  events: [] as any[],
  windowResizeDelay: 100,
});

watch(
  () => props.tasks,
  (tasks) => {
    calendarOptions.value.events = tasks
      .filter((t) => t.startDate || t.dueDate)
      .map((t) => ({
        id: t._id,
        title: t.name,
        start: t.startDate ?? t.dueDate,
        end: t.dueDate ?? undefined,
        allDay: true,
      }));
  },
  { immediate: true },
);
</script>

<template>
  <FullCalendar :options="calendarOptions" />
</template>
