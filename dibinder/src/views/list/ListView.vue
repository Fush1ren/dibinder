<script setup lang="ts">
import TaskDetail from '@/components/TaskDetail.vue';
import {
  useListStore,
  useSideBarStore,
  useTaskDetailStore,
  useTaskStore,
} from '@/stores';
import type { ParamsSearch, TasksResponse } from '@/types';
import { formatDate } from '@/utils/data';
import getElementStyle from '@/utils/styling';
import { Checkbox, InputText, useConfirm, useToast } from 'primevue';
import { ref, watch } from 'vue';
import DialogFormList from '@/components/DialogFormList.vue';
import { useRoute, useRouter } from 'vue-router';

const listStore = useListStore();
const sidebarStore = useSideBarStore();
const taskStore = useTaskStore();
const taskDetailStore = useTaskDetailStore();
const toast = useToast();
const confirm = useConfirm();
const route = useRoute();
const router = useRouter();

// onMounted(async () => {
//   const id = (route?.params as { listId: string })?.listId;
//   // await getList();
//   await getList(
//     search.value
//       ? {
//           search: search.value,
//         }
//       : undefined,
//     id,
//   );
// });

const isDone = ref<boolean[]>([]);
const isEditable = ref<boolean>(false);
const listName = ref<string>();
// const menuSort = ref<InstanceType<typeof Menu>>();
// const itemsMenu = ref<MenuItem[]>([
//   {
//     label: 'Task Name',
//     icon: 'akar-icons:sort',
//     command: () => {
//       console.log('Task Name');
//     },
//   },
// ]);
const search = ref<string>('');
const isShowSearch = ref<boolean>(false);

const setEditAble = () => {
  isEditable.value = !isEditable.value;
};

// const closeEditableName = () => {
//   isEditableName.value = false;
//   listName.value = listStore.listActive?.name;
// };

const showSearch = () => {
  isShowSearch.value = true;
};

const hideSearch = async (): Promise<void> => {
  isShowSearch.value = false;
  search.value = '';
  await getList({
    search: search.value,
  });
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

// const sortAction = (event: PointerEvent): void => {
//   menuSort.value?.toggle(event);
// };

const confirmDelete = (e: PointerEvent) => {
  e?.preventDefault();
  e?.stopPropagation();
  confirm.require({
    message: 'Do you want to delete this list?',
    header: listName.value,
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: async () => {
      await deleteList();
    },
  });
};

const getList = async (params?: ParamsSearch, id?: string) => {
  try {
    await listStore.getListById(
      id ?? (listStore.listActive?.id as string),
      params ?? undefined,
    );
    listStore.listActive = {
      id: listStore.list?._id as string,
      name: listStore.list?.name as string,
      color: listStore.list?.color as string,
    };
    isDone.value = listStore.list?.task?.map((d) => d?.done) as boolean[];
  } catch (e) {
    console.error(e);
  }
};

const setDone = async (e: boolean, data: TasksResponse): Promise<void> => {
  try {
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

    isEditable.value = false;
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Failed',
      detail: `${(e as Error)?.message}`,
      life: 3000,
    });
  }
};

const deleteList = async (): Promise<void> => {
  try {
    await listStore.deleteList(listStore.listActive?.id as string);

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Delete List was successfuly!',
      life: 3000,
    });

    await listStore.getList();

    router.push('/binder/tasks/today');
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Failed',
      detail: `${(e as Error)?.message}`,
      life: 3000,
    });
  }
};

const searchName = async (): Promise<void> => {
  try {
    await getList(
      search.value
        ? {
            search: search.value,
          }
        : undefined,
    );
  } catch (e) {
    console.error(e);
  }
};

const throwPath = (newId?: string) => {
  if (!newId) return;

  const listIdArr = listStore.lists?.map((data) => data._id) ?? [];

  if (listIdArr.includes(newId)) return;

  router.push(`/binder/tasks/today`);
};

watch(
  () => route?.params as { listId: string },
  async (newId, oldId) => {
    if (!newId || newId === oldId) return;
    throwPath(newId?.listId as string);
    isShowSearch.value = false;
    search.value = '';

    await getList(
      search.value
        ? {
            search: search.value,
          }
        : undefined,
      newId?.listId,
    );
  },
  { immediate: true },
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
        <div class="h-[5%]">
          <div class="flex gap-2">
            <div class="flex items-start gap-2">
              <h1 class="text-3xl font-bold pb-4">
                List -
                {{ listStore.list?.name }}
              </h1>
              <span
                @click="setEditAble"
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
        <div class="flex justify-end">
          <div class="flex gap-2">
            <!-- <div>
              <button
                @click="sortAction"
                :outlined="true"
                type="button"
                class="p-1 border border-black rounded-lg cursor-pointer"
              >
                <span class="!text-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-width="2"
                      d="M3 6h18M6 12h12m-9 6h6"
                    />
                  </svg>
                </span>
              </button>
              <Menu
                ref="menuSort"
                id="overlay_menu"
                :model="itemsMenu"
                :popup="true"
              >
                <template #item="{ item }">
                  <div class="flex items-center">
                    <Icon v-if="item.icon" :icon="item.icon" />
                    <span>{{ item.label }}</span>
                  </div>
                </template>
              </Menu>
            </div> -->
            <div v-if="isShowSearch" class="flex items-center gap-2">
              <span @click="hideSearch" class="text-red-500 cursor-pointer">
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
              class="p-2 border border-black rounded-lg cursor-pointer"
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
            <button
              @click.stop="confirmDelete"
              type="button"
              class="p-2 border border-black rounded-lg cursor-pointer"
            >
              <span class="text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m9.4 16.5l2.6-2.6l2.6 2.6l1.4-1.4l-2.6-2.6L16 9.9l-1.4-1.4l-2.6 2.6l-2.6-2.6L8 9.9l2.6 2.6L8 15.1zM7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM7 6v13z"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
        <div class="w-full h-[95%] flex flex-col py-4">
          <div
            @click="taskDetailStore.triggerAddNewTask(listStore.list)"
            class="w-full border border-gray-300 rounded-lg p-4 cursor-pointer"
          >
            <div class="flex flex-row items-center gap-4">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
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
  <DialogFormList
    v-model:visible="isEditable"
    :header="`Edit List - ${listStore?.list?.name}`"
    :data="listStore?.list"
    @submit="updateList"
  />
</template>
