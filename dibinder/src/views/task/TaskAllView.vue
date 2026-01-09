<script setup lang="ts">
import ButtonColor from '@/components/ButtonColor.vue';
import { useTaskDetailStore, useTaskStore } from '@/stores';
import type { ParamsGetList, TasksResponse } from '@/types';
import { formatDate } from '@/utils/data';
import { Checkbox, InputText } from 'primevue';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const taskStore = useTaskStore();
const taskDetailStore = useTaskDetailStore();

onMounted(() => {
  getTask();
  isDone.value = taskStore.taskDone;
});

const isDone = ref<boolean[]>([]);
const search = ref<string>('');
const isShowSearch = ref<boolean>(false);

const showSearch = () => {
  isShowSearch.value = !isShowSearch.value;
};

const setDone = async (e: boolean, data: TasksResponse): Promise<void> => {
  // (isDone.value as boolean[])[index] = !isDone.value;
  try {
    // console.log(e);
    const body = {
      done: e,
      subTask: data?.subTask as {
        name: string;
        done: boolean;
      }[],
    };
    await taskStore.updateTaskDone(data?._id, body);
    await taskStore.getTasks();
    taskDetailStore.closeTaskDetail();
    isDone.value = taskStore.tasks?.map((t) => t?.done) as boolean[];
  } catch (err) {
    console.error(err);
  }
};

const getTask = async (search?: string) => {
  try {
    if (route?.fullPath?.includes('today')) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const params = {
        sort: 'desc',
        search: search ?? undefined,
      } as ParamsGetList;
      params.startDate = JSON.stringify([startOfDay, endOfDay]);

      await taskStore.getTasks(params);
    } else {
      await taskStore.getTasks({
        search: search ?? undefined,
      });
    }

    isDone.value = taskStore.tasks?.map((t) => t?.done) as boolean[];
    // await taskStore.getTasks({
    //   sort: 'desc',
    // });

    // isDone.value = taskStore.tasks?.map((d) => d.done) as boolean[];
  } catch (e) {
    console.error(e);
  }
};

const searchName = async (): Promise<void> => {
  try {
    await getTask(search.value);
  } catch (e) {
    console.error(e);
  }
};

watch(
  () => route.fullPath,
  async () => {
    await getTask();
  },
  {
    immediate: true,
  },
);

watch(
  () => isShowSearch.value,

  async (s) => {
    if (!s) {
      search.value = '';
      await getTask(search.value);
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div
    class="w-full h-screen bg-bg-light dark:bg-bg-dark text-slate-900 dark:text-white"
  >
    <div class="w-full h-full p-4">
      <div class="h-[5%]">
        <h1 class="text-3xl font-bold pb-4">
          {{ route?.fullPath?.includes('today') ? 'Today' : 'All Task' }}
        </h1>
      </div>
      <div class="flex justify-end">
        <div class="flex gap-2">
          <div v-if="isShowSearch" class="flex items-center gap-2">
            <span @click="showSearch" class="text-red-500 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
                />
              </svg>
            </span>
            <InputText
              v-model="search"
              name="search"
              class="!bg-transparent !text-black"
              type="text"
              placeholder="Search task"
              size="small"
              fluid
              @keyup.enter="searchName"
            />
          </div>
          <button
            v-else-if="!isShowSearch"
            @click="showSearch"
            class="p-2 border border-black dark:border-white rounded-lg cursor-pointer"
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
      <div class="w-full h-[95%] flex flex-col py-4">
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
                  box: '!bg-transparent !border-black dark:!border-white !border-2 !rounded-sm',
                  icon: '!text-white !w-3 !h-3',
                }"
                binary
                @click.stop
                @update:model-value="setDone(!!$event, val)"
              />
              <div class="flex flex-col w-full">
                <span class="font-medium">{{ val?.name }}</span>
                <div
                  v-if="val?.dueDate || val?.list || val?.subTask"
                  class="flex items-center gap-4 text-sm text-[#92a4c9] mt-1"
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
                      :data="{
                        id: val?.list?._id,
                        name: val?.list?.name,
                        color: val?.list?.color as string,
                      }"
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
