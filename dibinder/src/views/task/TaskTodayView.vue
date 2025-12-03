<script setup lang="ts">
import ButtonColor from '@/components/ButtonColor.vue';
import { useTaskDetailStore, useTaskStore } from '@/stores';
import type { BodyTask, TasksResponse } from '@/types';
import { formatDate } from '@/utils/data';
import { Checkbox } from 'primevue';
import { onMounted, ref } from 'vue';

const taskStore = useTaskStore();
const taskDetailStore = useTaskDetailStore();

onMounted(() => getTask());

const isDone = ref<boolean[]>([]);

const setDone = async (e: boolean, data: TasksResponse): Promise<void> => {
  // (isDone.value as boolean[])[index] = !isDone.value;
  try {
    console.log(e);
    const body = {
      name: data?.name,
    } as BodyTask;
    await taskStore.updateTask(data?._id, body);
  } catch (err) {
    console.error(err);
  }
};

const getTask = async () => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const body = {
      sort: 'desc',
    } as { [key: string]: any };

    body.startDate = JSON.stringify([startOfDay, endOfDay]);

    await taskStore.getTasks(body);
    // await taskStore.getTasks({
    //   sort: 'desc',
    // });

    isDone.value = taskStore.tasks?.map((d) => d.done) as boolean[];
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <div class="w-full h-screen">
    <div class="w-full h-full p-4">
      <div class="h-[10%]">
        <h1 class="text-3xl font-bold pb-4">Today</h1>
      </div>

      <div class="w-full h-[90%] flex flex-col pt-4">
        <div
          @click="taskDetailStore.triggerAddNewTask()"
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
        <div class="my-4 overflow-y-auto">
          <div
            :key="i"
            v-for="(val, i) in taskStore.tasks"
            class="flex items-center justify-between border-b border-b-gray-300 w-full p-4 cursor-pointer last:border-none"
            @click="taskDetailStore.triggerEditTask(val)"
          >
            <div class="flex items-center gap-3 w-full">
              <Checkbox
                :key="i"
                v-model="(isDone as boolean[])[i]"
                :pt="{
                  box: '!bg-transparent !border-black !border-2 !rounded-sm',
                  icon: '!text-white !w-3 !h-3',
                }"
                binary
                @update:model-value="setDone(!!$event, val)"
              />
              <div class="flex flex-col w-full">
                <span class="text-gray-800 font-medium">{{ val?.name }}</span>
                <div
                  v-if="val?.dueDate || val?.list || val?.subTask"
                  class="flex items-center gap-4 text-sm text-gray-600 mt-1"
                >
                  <!-- Date -->
                  <div v-if="val?.dueDate" class="flex items-center gap-2">
                    <span class="text-gray-400 text-base">
                      <i class="pi pi-calendar-times" />
                    </span>

                    <span>{{ formatDate(new Date(val?.dueDate)) }}</span>
                  </div>

                  <!-- Divider -->
                  <span
                    v-if="val?.list"
                    class="border-l h-4 first:hidden last:hidden"
                  ></span>

                  <!-- List Name -->
                  <div class="flex items-center gap-2" v-if="val?.list">
                    <ButtonColor
                      :id="val?.list?._id"
                      :listColor="val?.list?.color"
                      :clickable="false"
                    />
                    <span>{{ val?.list?.name }}</span>
                  </div>

                  <!-- Divider -->
                  <span
                    v-if="val?.subTask?.length > 0"
                    class="border-l h-4 first:hidden last:hidden"
                  ></span>

                  <!-- Subtasks -->
                  <div
                    v-if="val?.subTask?.length > 0"
                    class="flex items-center gap-2"
                  >
                    <span
                      class="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-semibold"
                    >
                      {{ val?.subTask?.length }}
                    </span>
                    <span>Subtasks</span>
                  </div>
                </div>
              </div>
            </div>
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
</template>
