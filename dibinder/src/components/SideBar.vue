<script setup lang="ts">
import { useListStore } from '@/stores';
import type { ListResponse, BinderViewProps, SideBarTaskList } from '@/types';
import { api } from '@/utils/axios';
import {
  Button,
  ColorPicker,
  InputGroup,
  InputGroupAddon,
  InputText,
  Popover,
  useToast,
} from 'primevue';
import { onMounted, ref, shallowRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ButtonColor from './ButtonColor.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const listStore = useListStore();
const list = ref<ListResponse[]>();
const props = defineProps<BinderViewProps>();

const op = ref();
const colors = ref<string[]>([]);
const inputKey = shallowRef<number[]>([]);

const taskMenu = ref<SideBarTaskList[]>();
const loadingListData = ref<boolean>(false);

onMounted(() => {
  setTaskMenu();
  getDataList();
});

const setRoute = (path: string): void => {
  if (!path) return;
  router.push(path);
};

const handleKeypress = (event: KeyboardEvent): void => {
  const maxLength = 6;
  const targetId = (event?.target as any)?.id as string;

  const listIndex = list.value?.findIndex((l) => l._id === targetId) as number;

  const isMaxLengthReached = maxLength === colors.value[listIndex]?.length;
  if (isMaxLengthReached) {
    event.preventDefault();

    if (isMaxLengthReached && listIndex) {
      (inputKey.value as any)[listIndex]++;
    }
  }
};

const toggle = (event: Event) => {
  const classActive = (event.target as any)?.classList as { value: string };
  if (!classActive) return;
  if (!list.value) return;

  const idActive = classActive?.value
    ?.split(' ')
    ?.filter((item) => item.includes('list-'))[0]
    ?.replace('list-', '');
  const indexActive = Number(list.value?.findIndex((i) => i._id == idActive));
  if (colors.value) {
    colors.value[indexActive] = list.value[indexActive]?.color ?? '';
  }
  op.value[indexActive]?.toggle(event);
};

const setTaskMenu = (): void => {
  taskMenu.value = [
    {
      name: 'Today',
      link: '/binder/tasks/today',
      isActive: props?.routeName === 'taskToday',
    },
    {
      name: 'All Task',
      link: '/binder/all-task',
      isActive: props?.routeName === 'all-task',
    },
    {
      name: 'Calendar',
      link: '/binder/calendar',
      isActive: props?.routeName === 'calendar',
    },
  ];
};

const getDataList = async (): Promise<void> => {
  loadingListData.value = true;
  try {
    await listStore.getList();
    list.value = listStore.lists;
  } catch (e) {
    console.error(e);
  } finally {
    loadingListData.value = false;
  }
};

const updateList = async (
  id: string,
  name: string,
  color: string,
): Promise<void> => {
  try {
    if (!id && !name && !color) return;

    await api.patch(`/list/${id}`, {
      name,
      color,
    });

    await getDataList();

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Update List was successfuly!',
      life: 3000,
    });
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Failed',
      detail: `${(e as Error)?.message}`,
      life: 3000,
    });
  }
};

const updateColor = async (
  index: number,
  id: string,
  name: string,
  // color: string,
): Promise<void> => {
  // if (!id && !name && !color && !index) return;
  // await updateList(id, name, color[index] ?? '');
  // op.value[index]?.hide;
  const newColors = colors.value[index];
  await updateList(id, name, newColors ?? '');
  op.value[index]?.hide();
};

watch(
  () => route.path,
  () => setTaskMenu(),
  {
    immediate: true,
  },
);
</script>
<template>
  <div class="w-[25%] text-dark h-screen">
    <div class="w-full h-full">
      <div class="h-full bg-secondary rounded-e-xl flex flex-col">
        <div class="w-full flex flex-row justify-between items-center p-4">
          <h2 class="text-xl font-bold">Hi, {{ props?.username }}!</h2>
          <span class="cursor-pointer hover:bg-gray-300/50 rounded-md p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M3 18v-2h18v2zm0-5v-2h18v2zm0-5V6h18v2z"
              />
            </svg>
          </span>
        </div>
        <div class="w-full px-4">
          <div class="w-full pb-2">
            <span class="text-black text-normal font-bold">TASKS</span>
          </div>
          <div
            :key="index"
            v-for="(data, index) in taskMenu"
            :class="`flex items-center cursor-pointer ${data?.isActive ? 'bg-gray-300/60' : ''} hover:bg-gray-300/60 rounded-md mx-2 my-1 py-1`"
            @click="setRoute(data?.link)"
          >
            <div class="w-full flex flex-row items-center py-2">
              <span class="px-2">
                <svg
                  v-if="data?.name === 'Today'"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M9 16.5q-1.05 0-1.775-.725T6.5 14t.725-1.775T9 11.5t1.775.725T11.5 14t-.725 1.775T9 16.5M5 22q-.825 0-1.412-.587T3 20V6q0-.825.588-1.412T5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588T21 6v14q0 .825-.587 1.413T19 22zm0-2h14V10H5z"
                  />
                </svg>
                <svg
                  v-else-if="data?.name === 'All Task'"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M7 9V7h14v2zm0 4v-2h14v2zm0 4v-2h14v2zM4 9q-.425 0-.712-.288T3 8t.288-.712T4 7t.713.288T5 8t-.288.713T4 9m0 4q-.425 0-.712-.288T3 12t.288-.712T4 11t.713.288T5 12t-.288.713T4 13m0 4q-.425 0-.712-.288T3 16t.288-.712T4 15t.713.288T5 16t-.288.713T4 17"
                  />
                </svg>
                <svg
                  v-else-if="data?.name === 'Calendar'"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M5 22q-.825 0-1.412-.587T3 20V6q0-.825.588-1.412T5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588T21 6v14q0 .825-.587 1.413T19 22zm0-2h14V10H5zM5 8h14V6H5zm0 0V6zm7 6q-.425 0-.712-.288T11 13t.288-.712T12 12t.713.288T13 13t-.288.713T12 14m-4 0q-.425 0-.712-.288T7 13t.288-.712T8 12t.713.288T9 13t-.288.713T8 14m8 0q-.425 0-.712-.288T15 13t.288-.712T16 12t.713.288T17 13t-.288.713T16 14m-4 4q-.425 0-.712-.288T11 17t.288-.712T12 16t.713.288T13 17t-.288.713T12 18m-4 0q-.425 0-.712-.288T7 17t.288-.712T8 16t.713.288T9 17t-.288.713T8 18m8 0q-.425 0-.712-.288T15 17t.288-.712T16 16t.713.288T17 17t-.288.713T16 18"
                  />
                </svg>
              </span>
              <span class="w-full text-sm font-medium">
                {{ data?.name }}
              </span>
            </div>
            <div
              v-if="data?.name !== 'Calendar'"
              class="bg-primary mx-3 px-4 py-px rounded-md"
            >
              <span class="font-bold text-sm">5</span>
            </div>
          </div>
          <hr class="my-4 border-gray-400/40 ml-2" />
        </div>
        <div class="w-full px-4">
          <div class="w-full pb-2">
            <span class="text-black text-normal font-bold">LIST</span>
          </div>
          <div
            :key="index"
            v-for="(data, index) in list"
            class="flex items-center cursor-pointer rounded-md mx-2 my-1 py-1"
          >
            <div class="w-full flex flex-row items-center py-2">
              <ButtonColor
                @click="toggle"
                :id="data?._id"
                :listColor="data?.color"
              />

              <Popover
                ref="op"
                :pt="{
                  root: {
                    class: '!bg-white',
                  },
                }"
              >
                <form
                  @submit.prevent="updateColor(index, data?._id, data?.name)"
                >
                  <div class="flex flex-row gap-3 items-center">
                    <ColorPicker v-model="colors[index]" format="hex" />
                    <InputGroup>
                      <InputGroupAddon
                        :pt="{
                          root: {
                            class: '!bg-gray-200 !p-1 !border-black',
                          },
                        }"
                      >
                        <span class="text-lg font-bold text-black">#</span>
                      </InputGroupAddon>
                      <InputText
                        :key="inputKey[index]"
                        v-model="colors[index]"
                        :name="`color-${data?._id}`"
                        class="!bg-transparent !text-black"
                        type="text"
                        :id="`${data._id}`"
                        size="small"
                        @keypress="handleKeypress"
                        v-keyfilter.hex
                      />
                    </InputGroup>
                    <Button
                      label="Apply"
                      size="small"
                      type="submit"
                      class="!bg-blue-500 !text-white hover:!bg-blue-400"
                    />
                  </div>
                </form>
              </Popover>
              <span class="w-full text-sm font-medium">{{ data?.name }}</span>
            </div>
            <div class="bg-primary mx-3 px-4 py-px rounded-md">
              <span class="font-bold text-sm">{{ data?.task?.length }}</span>
            </div>
          </div>
          <div
            class="flex items-center cursor-pointer rounded-md mx-2 my-1 py-1"
          >
            <div class="w-full flex flex-row items-center py-2">
              <span class="ml-[12px] mr-[10px]">
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
              <span class="w-full text-sm font-medium">Add New List</span>
            </div>
          </div>
        </div>
        <hr class="my-4 border-gray-400/40 ml-2" />
        <div class="w-full h-full grid items-end">
          <div class="flex flex-col w-full gap-2 mb-3 mx-1">
            <div class="flex items-center cursor-pointer rounded-md mx-2">
              <div class="w-full flex flex-row items-center py-2">
                <span class="px-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5"
                    />
                  </svg>
                </span>
                <span class="w-full text-sm font-medium"> Settings </span>
              </div>
            </div>
            <div class="flex items-center cursor-pointer rounded-md mx-2">
              <div class="w-full flex flex-row items-center py-2">
                <span class="px-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"
                    />
                  </svg>
                </span>
                <span class="w-full text-sm font-medium"> Sign out </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
