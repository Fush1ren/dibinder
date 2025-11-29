<script setup lang="ts">
import { useTaskStore } from '@/stores';
import { Checkbox } from 'primevue';
import { onMounted } from 'vue';

const taskStore = useTaskStore();

onMounted(() => getTask());

const getTask = async () => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    await taskStore.getTasks({
      sort: 'desc',
    });
    // await taskStore.getTasks({
    //   createdAt: JSON.stringify([startOfDay, endOfDay]),
    // });
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <div class="w-full h-full">
    <div class="w-full p-4">
      <h1 class="text-3xl font-bold pb-4">Today</h1>

      <div class="w-full flex flex-col py-4">
        <div
          class="w-full border border-gray-300 rounded-lg p-4 cursor-pointer"
        >
          <div class="flex flex-row items-center gap-4">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M11 21v-8H3v-2h8V3h2v8h8v2h-8v8z"
                />
              </svg>
            </span>
            <span>Add New Task</span>
          </div>
        </div>
        <div class="py-4">
          <div
            :key="i"
            v-for="(val, i) in taskStore.tasks"
            class="border-b border-b-gray-300 w-full"
          >
            <div class="flex w-full gap-4 px-4 py-2 items-center">
              <Checkbox />

              <div class="flex w-full flex-col">
                <div class="flex justify-between items-center">
                  <span>{{ val?.name }}</span>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                    >
                      <path
                        fill="currentColor"
                        d="M12.6 12L8 7.4L9.4 6l6 6l-6 6L8 16.6z"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
