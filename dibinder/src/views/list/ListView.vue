<script setup lang="ts">
import DialogActionList from '@/components/DialogActionList.vue';
import TaskDetail from '@/components/TaskDetail.vue';
import {
  useListStore,
  useSideBarStore,
  useTaskDetailStore,
  useTaskStore,
} from '@/stores';
import type { TasksResponse } from '@/types';
import { formatDate } from '@/utils/data';
import getElementStyle from '@/utils/styling';
import { Checkbox, useToast } from 'primevue';
import { onMounted, ref, watch } from 'vue';

const listStore = useListStore();
const sidebarStore = useSideBarStore();
const taskStore = useTaskStore();
const taskDetailStore = useTaskDetailStore();
const toast = useToast();

onMounted(() => getList());

const isDone = ref<boolean[]>([]);
const isEditableName = ref<boolean>(false);
const listName = ref<string>();

const setEditAbleName = () => {
  isEditableName.value = !isEditableName.value;
};

const closeEditableName = () => {
  isEditableName.value = false;
  listName.value = listStore.listActive?.name;
};

const clickTask = (
  val: Omit<TasksResponse, 'list'> & {
    list: string;
  },
): void => {
  taskDetailStore.triggerEditTask({
    _id: val?._id,
    name: val?.name,
    description: val?.description,
    done: val?.done,
    list: val?.list
      ? {
          _id: val?.list as string,
          name: listStore.list?.name as string,
          color: listStore.list?.color as string,
        }
      : null,
    startDate: val?.startDate,
    dueDate: val?.dueDate,
    subTask: val?.subTask,
    user: val?.user,
  });
};

const getList = async () => {
  try {
    await listStore.getListById(listStore.listActive?.id!);
    isDone.value = listStore.list?.task?.map((d) => d?.done) as boolean[];
    // await listStore.getListById(listStorage?.listActive?.id!);
  } catch (e) {
    console.error(e);
  }
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
    await getList();
    taskDetailStore.closeTaskDetail();
    isDone.value = listStore.list?.task?.map((t) => t?.done) as boolean[];
  } catch (err) {
    console.error(err);
  }
};

const updateList = async (e: {
  id: string | undefined;
  name: string;
  colors: string;
}): Promise<void> => {
  try {
    if (!e?.id && !e?.name) return;

    await listStore.updateList(e?.id as string, {
      name: e?.name as string,
      color: e?.colors ?? '',
    });

    await listStore.getList();
    await listStore.getListById(e?.id!);

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Change Color List was successfuly!',
      life: 3000,
    });

    isEditableName.value = false;
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Failed',
      detail: `${(e as Error)?.message}`,
      life: 3000,
    });
  }
};

watch(
  () => listStore.listActive,
  async () => {
    await getList();
    closeEditableName();
    listName.value = listStore.listActive?.name;
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
    <div class="w-full h-screen">
      <div class="w-full h-full p-4">
        <div class="h-[10%]">
          <div class="flex gap-2">
            <div class="flex items-start gap-2">
              <h1 class="text-3xl font-bold pb-4">
                List -
                {{ listStore.list?.name }}
              </h1>
              <span
                @click="setEditAbleName"
                class="hover:text-gray-400 cursor-pointer pb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#000000"
                    d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-2 2v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z"
                  />
                </svg>
              </span>
            </div>
          </div>
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
              v-for="(val, i) in listStore.list?.task"
              class="flex items-center justify-between border-b border-b-gray-300 w-full p-4 cursor-pointer last:border-none"
              @click="clickTask(val as any)"
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
                  @click.stop
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
  </div>
  <TaskDetail />
  <DialogActionList
    v-model:visible="isEditableName"
    :header="`Edit List - ${listStore?.list?.name}`"
    :data="listStore?.list"
    @submit="updateList"
  />
</template>
