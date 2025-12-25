<script setup lang="ts">
import {
  useListStore,
  useSideBarStore,
  useTaskDetailStore,
  useTaskStore,
} from '@/stores';
import type { BodyTask, ErrorsForm, ListDropdownResponse } from '@/types';
import getElementStyle from '@/utils/styling';
import {
  Form,
  type FormResolverOptions,
  type FormSubmitEvent,
} from '@primevue/forms';
import {
  Button,
  Checkbox,
  ConfirmDialog,
  DatePicker,
  Dialog,
  InputText,
  Select,
  Textarea,
  useConfirm,
  useToast,
} from 'primevue';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const sidebarStore = useSideBarStore();
const listStore = useListStore();
const taskStore = useTaskStore();
const taskDetailStore = useTaskDetailStore();
const toast = useToast();
const confirm = useConfirm();
const route = useRoute();

const initialValues = ref<BodyTask>();
const name = ref<string>();
const description = ref<string>();
const startDate = ref<Date | null>();
const dueDate = ref<Date | null>();
const subTask = ref<
  {
    done: boolean;
    name: string;
  }[]
>([]);
const newSubTask = ref<string>('');
const visibleDialog = ref<boolean>(false);
const listTask = ref<ListDropdownResponse>();
const listOptions = ref<ListDropdownResponse[]>();

const dragIndex = ref<number | null>(null);

function startDrag(index: number) {
  dragIndex.value = index;
}

function onDrop(dropIndex: number) {
  if (dragIndex.value === null) return;

  const draggedItem = subTask.value[dragIndex.value]!;

  // Hapus item dari lokasi lama
  subTask.value.splice(dragIndex.value, 1);

  // Masukkan item ke lokasi baru
  subTask.value.splice(dropIndex, 0, draggedItem);

  dragIndex.value = null;
}

const openAddSubTask = (): void => {
  visibleDialog.value = true;
};

const addSubTask = (): void => {
  subTask.value?.push({
    done: false,
    name: newSubTask.value,
  });
  newSubTask.value = '';
  visibleDialog.value = false;
};

const deleteSubTask = (index: number): void => {
  subTask.value?.splice(index, 1);
};

const openSelect = async () => {
  try {
    await listStore.getListDropdown();
    listOptions.value = listStore.listDropdown;
  } catch (e) {
    console.error(e);
  }
};

const resolver = async (
  val: FormResolverOptions,
): Promise<Record<string, any>> => {
  const values = val?.values;

  const errors = {
    task: [] as ErrorsForm[],
    description: [] as ErrorsForm[],
    startDate: [] as ErrorsForm[],
    dueDate: [] as ErrorsForm[],
  };

  if (!values?.task) {
    errors.task = [{ message: 'Task name is required' }];
  } else if (values?.task?.length > 20) {
    errors.task = [{ message: 'Task names must not exceed 20 characters' }];
  }

  if (values?.description?.length > 50) {
    errors.description = [
      { message: 'Description must not exceed 50 characters' },
    ];
  }

  if (values?.startDate && values?.dueDate) {
    const start = new Date(values?.startDate);
    const end = new Date(values?.endDate);

    if (start > end) {
      errors.startDate = [
        { message: 'The start date cannot be later than the end date' },
      ];
    }

    if (end < start) {
      errors.startDate = [
        { message: 'The end date cannot be before the end date.' },
      ];
    }
  }

  return {
    errors,
  };
};

const actionForm = async (e: FormSubmitEvent): Promise<void> => {
  try {
    if (!e?.valid) return;
    const dataDate = {
      startDate: startDate?.value ? new Date(startDate?.value) : null,
      dueDate: dueDate?.value ? new Date(dueDate?.value) : null,
    };
    dataDate.startDate ? dataDate.startDate?.setHours(12, 0, 0, 0) : null;
    dataDate.dueDate ? dataDate.dueDate?.setHours(12, 0, 0, 0) : null;
    const done =
      subTask?.value?.length > 0
        ? subTask?.value.every((i) => i.done === true)
        : taskDetailStore?.task?.done;

    if (taskDetailStore.task?._id) {
      await taskStore.updateTask(taskDetailStore.task?._id, {
        name: e?.states?.task?.value,
        done: done as boolean,
        description: e?.states?.description?.value,
        list: (e?.states?.list?.value as ListDropdownResponse)?._id,
        startDate: dataDate.startDate
          ? new Date(dataDate.startDate?.toISOString())
          : null,
        dueDate: dataDate.dueDate
          ? new Date(dataDate.dueDate?.toISOString())
          : null,
        subTask: subTask?.value,
      });
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Update task was successfully!',
        life: 3000,
      });
    } else {
      await taskStore.createTask({
        name: e?.states?.task?.value,
        done: false,
        description: e?.states?.description?.value,
        list: (e?.states?.list?.value as ListDropdownResponse)?._id,
        startDate: dataDate.startDate
          ? new Date(dataDate.startDate?.toISOString())
          : null,
        dueDate: dataDate.dueDate
          ? new Date(dataDate.dueDate?.toISOString())
          : null,
        subTask: subTask?.value,
      });
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Create task was successfully!',
        life: 3000,
      });
    }

    await listStore.getList();
    await taskStore.getTaskLength();

    if (route?.fullPath?.includes('/binder/tasks/today')) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const body = {
        sort: 'desc',
      } as { [key: string]: any };
      body.startDate = JSON.stringify([startOfDay, endOfDay]);

      await taskStore.getTasks(body);
    } else if (route?.fullPath?.includes('/binder/tasks/all-task')) {
      await taskStore.getTasks();
    } else {
      await listStore.getListById(listStore.listActive?.id!);
    }

    name.value = undefined;
    description.value = undefined;
    listTask.value = undefined;
    startDate.value = undefined;
    dueDate.value = undefined;
    subTask.value = [];
    taskDetailStore.clearTask();
    taskDetailStore.closeTaskDetail();
  } catch (e) {
    console.error(e);
    toast.add({
      severity: 'error',
      summary: 'Failed',
      detail: `${(e as Error)?.message}`,
      life: 3000,
    });
  }
};

const confirmDelete = () => {
  confirm.require({
    message: 'Do you want to delete this task?',
    header: `${taskDetailStore.task?.name}`,
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
      await deleteTask();
    },
  });
};

const deleteTask = async (): Promise<void> => {
  try {
    if (!taskDetailStore.task?._id) return;

    await taskStore.deleteTask(taskDetailStore.task?._id);

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Delete task was successfully!',
      life: 3000,
    });

    if (route?.fullPath?.includes('/binder/tasks/today')) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const body = {
        sort: 'desc',
      } as { [key: string]: any };
      body.startDate = JSON.stringify([startOfDay, endOfDay]);

      await taskStore.getTasks(body);
    } else if (route?.fullPath?.includes('/binder/tasks/all-task')) {
      await taskStore.getTasks();
    } else {
      await listStore.getListById(listStore.listActive?.id!);
    }

    await listStore.getList();
    await taskStore.getTaskLength();

    name.value = undefined;
    description.value = undefined;
    listTask.value = undefined;
    startDate.value = undefined;
    dueDate.value = undefined;
    subTask.value = [];
    taskDetailStore.clearTask();
    taskDetailStore.closeTaskDetail();
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
  () => taskDetailStore.task,
  () => {
    name.value = taskDetailStore.task?.name;
    description.value = taskDetailStore.task?.description;
    listTask.value = taskDetailStore.task?.list as ListDropdownResponse;
    listOptions.value = listStore.listDropdown;
    startDate.value = taskDetailStore.task?.startDate
      ? new Date(taskDetailStore.task?.startDate)
      : null;
    dueDate.value = taskDetailStore.task?.dueDate
      ? new Date(taskDetailStore.task?.dueDate)
      : null;
    subTask.value = taskDetailStore.task?.subTask
      ? (taskDetailStore.task?.subTask?.map((i) => ({
          done: i?.done,
          name: i?.name,
        })) as { done: boolean; name: string }[])
      : [];
  },
);

watch(
  () => route?.fullPath,
  () => taskDetailStore.closeTaskDetail(),
  {
    immediate: true,
  },
);
</script>

<template>
  <div
    v-if="taskDetailStore.isOpen"
    :class="
      getElementStyle(sidebarStore.isOpen, taskDetailStore.isOpen).taskDetail
    "
  >
    <div class="w-full h-full">
      <Form
        v-slot="_$form"
        :initialValues
        :resolver="resolver"
        class="h-full bg-secondary rounded-l-xl flex flex-col justify-between"
        @submit="actionForm"
      >
        <div class="h-[90%] flex flex-col">
          <div
            class="w-full h-[10%] flex flex-row justify-between items-center py-4 px-8"
          >
            <h2 class="text-xl font-bold">Task:</h2>
            <span
              class="cursor-pointer"
              @click="taskDetailStore.closeTaskDetail()"
            >
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
          </div>
          <div class="w-full h-[90%] px-8">
            <div class="flex flex-col gap-4 h-[60%]">
              <InputText
                v-model="name"
                name="task"
                class="!bg-transparent !text-black"
                type="text"
                placeholder="Task name"
                size="small"
                fluid
              />

              <Textarea
                v-model="description"
                class="!bg-transparent !h-24"
                name="description"
                style="resize: none"
                placeholder="Description"
                fluid
              />

              <div class="flex items-center gap-12">
                <span class="text-black text-normal font-medium">List</span>
                <Select
                  v-model="listTask"
                  name="list"
                  placeholder="Select list"
                  option-label="name"
                  :options="listOptions"
                  @show="openSelect"
                  size="small"
                  class="!bg-transparent"
                  :show-clear="true"
                />
              </div>
              <div class="flex items-center gap-12">
                <span class="text-black text-normal font-medium"
                  >Start Date</span
                >
                <DatePicker
                  v-model="startDate"
                  showIcon
                  fluid
                  iconDisplay="input"
                  date-format="M dd, yy"
                  name="startDate"
                  placeholder="Select date"
                  :pt="{
                    root: {
                      class: ['!text-sm !text-black'],
                    },
                    panel: {
                      class: ['!bg-white !text-black'],
                    },
                    pcInputText: {
                      root: {
                        class: [
                          '!text-xs !text-black !bg-transparent !border-black ',
                        ],
                      },
                    },
                    header: {
                      class: [
                        '!text-sm !bg-gray-300/10 !text-black !rounded-lg !border-none !pb-0 !py-1',
                      ],
                    },
                    dayView: {
                      class: ['!text-sm !text-black'],
                    },
                    day: {
                      class: ['!text-black hover:!bg-[#e9eff1]'],
                    },
                    month: {
                      class: ['!text-black hover:!bg-[#e9eff1]'],
                    },
                    year: {
                      class: ['!text-black hover:!bg-[#e9eff1]'],
                    },
                    weekDay: {
                      class: ['!text-black'],
                    },
                    selectMonth: {
                      class: ['!text-black  hover:!bg-[#e9eff1]'],
                    },
                    selectYear: {
                      class: ['!text-black  hover:!bg-[#e9eff1]'],
                    },
                    pcPrevButton: {
                      root: {
                        class: [' hover:!bg-[#e9eff1]'],
                      },
                    },
                    pcNextButton: {
                      root: {
                        class: [' hover:!bg-[#e9eff1]'],
                      },
                    },
                  }"
                />
              </div>
              <div class="flex items-center gap-12">
                <span class="text-black text-normal font-medium">Due Date</span>
                <DatePicker
                  v-model="dueDate"
                  showIcon
                  fluid
                  iconDisplay="input"
                  date-format="M dd, yy"
                  name="dueDate"
                  placeholder="Select date"
                  :pt="{
                    root: {
                      class: ['!text-sm !text-black'],
                    },
                    panel: {
                      class: ['!bg-white !text-black'],
                    },
                    pcInputText: {
                      root: {
                        class: [
                          '!text-xs !text-black !bg-transparent !border-black ',
                        ],
                      },
                    },
                    header: {
                      class: [
                        '!text-sm !bg-gray-300/10 !text-black !rounded-lg !border-none !pb-0 !py-1',
                      ],
                    },
                    dayView: {
                      class: ['!text-sm !text-black'],
                    },
                    day: {
                      class: ['!text-black hover:!bg-[#e9eff1]'],
                    },
                    month: {
                      class: ['!text-black hover:!bg-[#e9eff1]'],
                    },
                    year: {
                      class: ['!text-black hover:!bg-[#e9eff1]'],
                    },
                    weekDay: {
                      class: ['!text-black'],
                    },
                    selectMonth: {
                      class: ['!text-black  hover:!bg-[#e9eff1]'],
                    },
                    selectYear: {
                      class: ['!text-black  hover:!bg-[#e9eff1]'],
                    },
                    pcPrevButton: {
                      root: {
                        class: [' hover:!bg-[#e9eff1]'],
                      },
                    },
                    pcNextButton: {
                      root: {
                        class: [' hover:!bg-[#e9eff1]'],
                      },
                    },
                  }"
                />
              </div>
            </div>
            <div class="h-[40%]">
              <h2 class="h-[25%] text-xl font-bold pt-4 pb-2">Subtasks:</h2>
              <div class="h-[15%] border-b border-b-gray-400/40 pb-4">
                <div
                  class="flex flex-row items-center gap-4 px-2 cursor-pointer"
                  @click="openAddSubTask()"
                >
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M11 21v-8H3v-2h8V3h2v8h8v2h-8v8z"
                      />
                    </svg>
                  </span>
                  <span class="text-sm">Add New Task</span>
                </div>
              </div>
              <div class="h-[60%] overflow-y-auto">
                <div class="flex flex-col gap-3 py-3">
                  <div
                    :key="index"
                    v-for="(data, index) in subTask"
                    class="w-full px-2 cursor-grab subtask"
                    draggable="true"
                    @dragstart="startDrag(index)"
                    @dragover.prevent
                    @drop="onDrop(index)"
                  >
                    <div class="flex justify-between items-center">
                      <div class="flex items-center gap-3">
                        <Checkbox
                          :key="index"
                          v-model="
                            (subTask[index] as { done: boolean; name: string })
                              .done
                          "
                          :name="`done-${index}`"
                          :pt="{
                            box: '!bg-transparent !border-black !border-2 !rounded-sm',
                            icon: '!text-white !w-3 !h-3',
                          }"
                          binary
                        />

                        <span class="text-black text-normal font-medium">
                          {{ data?.name }}
                        </span>
                      </div>

                      <span
                        class="text-red-500 cursor-pointer"
                        @click="deleteSubTask(index)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="m9.4 16.5l2.6-2.6l2.6 2.6l1.4-1.4l-2.6-2.6L16 9.9l-1.4-1.4l-2.6 2.6l-2.6-2.6L8 9.9l2.6 2.6L8 15.1zM7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM7 6v13z"
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
        <div
          :class="`h-[10%] flex ${taskDetailStore?.task?._id ? 'justify-between' : 'justify-end'} py-4 px-6`"
        >
          <Button
            v-if="taskDetailStore?.task?._id"
            @click="confirmDelete"
            type="button"
            label="Delete Task"
            size="small"
            outlined
            class="!text-[#EAEFFE] hover:!bg-red-400"
          />
          <Button
            type="submit"
            :label="taskDetailStore?.task?._id ? 'Save changes' : 'Create Task'"
            size="small"
            class="!bg-blue-500 !text-[#EAEFFE] hover:!bg-blue-400"
          />
        </div>
      </Form>
    </div>
  </div>
  <Dialog
    v-model:visible="visibleDialog"
    modal
    header="Add Subtask"
    :style="{ width: '25rem' }"
    :pt="{
      header: '!px-5 !pt-4',
    }"
    :draggable="false"
  >
    <Form
      v-slot="_$form"
      :initialValues
      class="flex flex-col gap-4 w-full pt-4"
      @submit="addSubTask"
    >
      <div class="flex flex-col gap-2">
        <label for="email" class="text-sm">
          <span>Name</span>
          <span class="text-red-500"> * </span>
        </label>
        <InputText
          v-model="newSubTask"
          id="taskName"
          name="taskName"
          size="small"
        />
        <!-- <Message
            v-if="$form?.email?.invalid"
            class="text-sm"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form?.email?.error?.message }}
          </Message> -->
      </div>
      <div class="flex justify-end">
        <Button
          type="submit"
          label="Add"
          size="small"
          class="!bg-blue-500 !text-[#EAEFFE] hover:!bg-blue-400"
        />
      </div>
    </Form>
  </Dialog>
  <ConfirmDialog />
</template>
