<script setup lang="ts"></script>

<template>
  <div class="w-full h-full">
    <div class="w-full p-4">
      <h1 class="text-3xl font-bold pb-4">Today</h1>

      <div class="w-full flex py-4">
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
      </div>
    </div>
  </div>
</template>
