<script setup lang="ts">
import { useSideBarStore } from '@/stores';
import getElementStyle from '@/utils/styling';
import { InputText, Select, Textarea } from 'primevue';

const sidebarStore = useSideBarStore();
</script>

<template>
  <div :class="getElementStyle(sidebarStore.isOpen).taskDetail">
    <div class="w-full h-full">
      <div class="h-full bg-secondary rounded-l-xl flex flex-col">
        <div
          class="w-full flex flex-row justify-between items-center py-4 px-8"
        >
          <h2 class="text-xl font-bold">Task:</h2>
          <span>
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
        <div class="w-full px-8">
          <div class="flex flex-col gap-4">
            <InputText
              name="task"
              class="!bg-transparent !text-black"
              type="text"
              placeholder="Task name"
              size="small"
              fluid
            />

            <Textarea
              class="!bg-transparent !h-24"
              name="description"
              style="resize: none"
              placeholder="Description"
              fluid
            />

            <div class="flex items-center gap-12">
              <span class="text-black text-normal font-medium">List</span>
              <Select placeholder="Select list" class="!bg-transparent" />
            </div>
            <div class="flex items-center gap-12">
              <span class="text-black text-normal font-medium">Due Date</span>
              <Select placeholder="Select list" class="!bg-transparent" />
            </div>

            <h2 class="text-xl font-bold">Subtasks:</h2>
            <div class="border-b border-b-gray-400/40 pb-4">
              <div class="flex flex-row items-center gap-4 px-2">
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
