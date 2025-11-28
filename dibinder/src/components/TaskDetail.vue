<script setup lang="ts">
import { InputText, Select, Textarea } from 'primevue';
</script>

<template>
  <div class="w-[30%] h-screen text-dark">
    <div class="w-full h-full">
      <div class="h-full bg-secondary rounded-l-xl flex flex-col">
        <div
          class="w-full flex flex-row justify-between items-center py-4 px-8"
        >
          <h2 class="text-xl font-bold">Task:</h2>
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
              <span class="text-black text-normal font-medium">Start Date</span>
              <Select placeholder="Select list" class="!bg-transparent" />
            </div>
            <div class="flex items-center gap-12">
              <span class="text-black text-normal font-medium">Due Date</span>
              <Select placeholder="Select list" class="!bg-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
