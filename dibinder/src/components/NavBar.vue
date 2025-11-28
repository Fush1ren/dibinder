<script setup lang="ts">
import { Button } from 'primevue';
import { useRouter } from 'vue-router';

const router = useRouter();

const moveRoute = (str: string): void => {
  if (!str) return;
  router.push(str);
};
</script>
<template>
  <header class="absolute z-[50] w-full bg-primary/70">
    <div class="p-4 flex justify-between">
      <div class="flex justify-center items-center">
        <span class="font-lovelo font-black text-xl text-dark uppercase">
          Dibinder
        </span>
      </div>
      <div class="">
        <Button
          @click="moveRoute('/login')"
          class="!bg-transparent !border-none"
        >
          <span class="text-dark">Login</span>
        </Button>
        <Button
          @click="moveRoute('/sign-up')"
          class="!bg-transparent !border-none"
        >
          <span class="text-dark">Register</span>
        </Button>
      </div>
    </div>
  </header>
</template>
