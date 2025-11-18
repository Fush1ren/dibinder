<script setup lang="ts">
import { SignedIn, SignedOut, UserButton } from '@clerk/vue';
import { Button } from 'primevue';
import { useRouter } from 'vue-router';

const router = useRouter();

const moveRoute = (str: string): void => {
  if (!str) return;
  router.push(str);
};
</script>
<template>
  <header class="w-full bg-gray-900">
    <div class="p-4 flex justify-between">
      <div class="flex justify-center items-center">
        <span class="font-lovelo font-black text-xl text-white uppercase">
          Dibinder
        </span>
      </div>
      <div class="">
        <SignedOut>
          <Button
            @click="moveRoute('/login')"
            class="!bg-transparent !border-none"
          >
            <span class="text-white">Login</span>
          </Button>
          <Button
            @click="moveRoute('/sign-up')"
            class="!bg-transparent !border-none"
          >
            <span class="text-white">Register</span>
          </Button>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  </header>
</template>
